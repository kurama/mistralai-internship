package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gage-technologies/mistral-go"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

type ChatRequest struct {
    Message      string `json:"message"`
    ApiKey       string `json:"apiKey,omitempty"`
    IsSignedIn   bool   `json:"isSignedIn,omitempty"`
}

type ChatResponse struct {
    Reply string `json:"reply"`
}

type ErrorResponse struct {
    Error string `json:"error"`
    Code  string `json:"code,omitempty"`
}

var db *sql.DB

// CORS middleware
func enableCORS(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
    
    if r.Method == "OPTIONS" {
        w.WriteHeader(http.StatusOK)
        return
    }
}

func isRateLimited(ip string) bool {
    now := time.Now()
    oneHour := now.Add(-time.Hour)

    // Start a transaction to avoid race conditions
    tx, err := db.Begin()
    if err != nil {
        log.Printf("Error starting transaction: %v", err)
        return false // Fail open
    }
    defer tx.Rollback()

    // Check/retrieve the record for this IP
    var count int
    var windowStart time.Time
    
    err = tx.QueryRow(`
        SELECT request_count, window_start 
        FROM rate_limit 
        WHERE ip_address = $1
    `, ip).Scan(&count, &windowStart)
    
    if err == sql.ErrNoRows {
        // First request from this IP - create the record
        _, err = tx.Exec(`
            INSERT INTO rate_limit (ip_address, request_count, window_start) 
            VALUES ($1, 1, $2)
        `, ip, now)
        if err != nil {
            log.Printf("Error inserting new rate limit: %v", err)
            return false // Fail open
        }
        tx.Commit()
        return false // Allowed (first request)
    } else if err != nil {
        log.Printf("Error querying rate limit: %v", err)
        return false // Fail open
    }

    // If the 1-hour window has expired, reset
    if windowStart.Before(oneHour) {
        _, err = tx.Exec(`
            UPDATE rate_limit 
            SET request_count = 1, window_start = $1 
            WHERE ip_address = $2
        `, now, ip)
        if err != nil {
            log.Printf("Error resetting rate limit: %v", err)
            return false // Fail open
        }
        tx.Commit()
        return false // Allowed (window reset)
    }

    // Check if the limit is reached
    if count >= 3 {
        tx.Commit() // No need to update, just commit to release the lock
        return true // Blocked
    }

    // Increment the counter
    _, err = tx.Exec(`
        UPDATE rate_limit 
        SET request_count = request_count + 1 
        WHERE ip_address = $1
    `, ip)
    if err != nil {
        log.Printf("Error incrementing rate limit: %v", err)
        return false // Fail open
    }

    tx.Commit()
    return false // Allowed
}

func getClientIP(r *http.Request) string {
    return r.RemoteAddr
}

func main() {
    _ = godotenv.Load()

    defaultApiKey := os.Getenv("MISTRAL_API_KEY")
    if defaultApiKey == "" {
        log.Fatal("MISTRAL_API_KEY is not set")
    }

    databaseURL := os.Getenv("DATABASE_URL")
    if databaseURL == "" {
        log.Fatal("DATABASE_URL is not set")
    }

    var err error
    db, err = sql.Open("postgres", databaseURL)
    if err != nil {
        log.Fatalf("Failed to connect to database: %v", err)
    }
    defer db.Close()

    if err := db.Ping(); err != nil {
        log.Fatalf("Failed to ping database: %v", err)
    }

    log.Println("Connected to database successfully")

    http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
        enableCORS(w, r)
        if r.Method == "OPTIONS" {
            return
        }
        
        w.WriteHeader(http.StatusOK)
        w.Write([]byte("OK"))
    })

    http.HandleFunc("/chat", func(w http.ResponseWriter, r *http.Request) {
        enableCORS(w, r)
        if r.Method == "OPTIONS" {
            return
        }

        if r.Method != http.MethodPost {
            http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
            return
        }

        var req ChatRequest
        if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
            http.Error(w, "Invalid request", http.StatusBadRequest)
            return
        }

        if req.Message == "" {
            http.Error(w, "Message is required", http.StatusBadRequest)
            return
        }

        // Determine which API key to use
        apiKeyToUse := req.ApiKey
        isUsingCustomKey := apiKeyToUse != ""
        
        if (apiKeyToUse == "") {
            // If user is signed in but has no API key, show API key error
            if req.IsSignedIn {
                w.Header().Set("Content-Type", "application/json")
                w.WriteHeader(http.StatusUnauthorized)
                json.NewEncoder(w).Encode(ErrorResponse{
                    Error: "Invalid API key. Please check your Mistral API key and try again.",
                    Code:  "INVALID_API_KEY",
                })
                return
            }
            
            // Using default API key - check rate limiting for non-signed users
            clientIP := getClientIP(r)
            if isRateLimited(clientIP) {
                w.Header().Set("Content-Type", "application/json")
                w.WriteHeader(http.StatusTooManyRequests)
                json.NewEncoder(w).Encode(ErrorResponse{
                    Error: "Rate limit exceeded. Please sign in to continue.",
                    Code:  "RATE_LIMIT_EXCEEDED",
                })
                return
            }
            apiKeyToUse = defaultApiKey
        }

        client := mistral.NewMistralClientDefault(apiKeyToUse)

        chatRes, err := client.Chat(
            "mistral-tiny",
            []mistral.ChatMessage{{Content: req.Message, Role: mistral.RoleUser}},
            &mistral.ChatRequestParams{
                Temperature: 1,
                TopP:        1,
                RandomSeed:  42069,
                MaxTokens:   120,
                SafePrompt:  false,
            },
        )
        if err != nil {
            log.Printf("Mistral API error: %v", err)
            
            // Check if it's an API key error
            errorStr := err.Error()
            if isUsingCustomKey && (strings.Contains(errorStr, "401") || 
                strings.Contains(errorStr, "unauthorized") || 
                strings.Contains(errorStr, "invalid") ||
                strings.Contains(errorStr, "authentication")) {
                w.Header().Set("Content-Type", "application/json")
                w.WriteHeader(http.StatusUnauthorized)
                json.NewEncoder(w).Encode(ErrorResponse{
                    Error: "Invalid API key. Please check your Mistral API key and try again.",
                    Code:  "INVALID_API_KEY",
                })
                return
            }
            
            // Generic error
            w.Header().Set("Content-Type", "application/json")
            w.WriteHeader(http.StatusInternalServerError)
            json.NewEncoder(w).Encode(ErrorResponse{
                Error: "Unable to process your request. Please try again later.",
                Code:  "API_ERROR",
            })
            return
        }

        reply := ""
        if len(chatRes.Choices) > 0 {
            reply = chatRes.Choices[0].Message.Content
        }

        resp := ChatResponse{Reply: reply}
        w.Header().Set("Content-Type", "application/json")
        if err := json.NewEncoder(w).Encode(resp); err != nil {
            log.Printf("JSON encoding error: %v", err)
            w.Header().Set("Content-Type", "application/json")
            w.WriteHeader(http.StatusInternalServerError)
            json.NewEncoder(w).Encode(ErrorResponse{
                Error: "Failed to process response",
                Code:  "ENCODING_ERROR",
            })
            return
        }
    })

    log.Println("Backend running on :8080")
    if err := http.ListenAndServe(":8080", nil); err != nil {
        log.Fatalf("Server failed: %v", err)
    }
}