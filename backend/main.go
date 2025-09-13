package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/gage-technologies/mistral-go"
	"github.com/joho/godotenv"
)

type ChatRequest struct {
    Message string `json:"message"`
    ApiKey  string `json:"apiKey,omitempty"` // Optional API key
}

type ChatResponse struct {
    Reply string `json:"reply"`
}

// Rate limiting for free tier
var (
    ipRequests = make(map[string][]time.Time)
    ipMutex    = sync.RWMutex{}
)

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
    ipMutex.Lock()
    defer ipMutex.Unlock()
    
    now := time.Now()
    oneHour := now.Add(-time.Hour)
    
    // Clean old requests
    if requests, exists := ipRequests[ip]; exists {
        var validRequests []time.Time
        for _, reqTime := range requests {
            if reqTime.After(oneHour) {
                validRequests = append(validRequests, reqTime)
            }
        }
        ipRequests[ip] = validRequests
        
        // Check if limit exceeded (3 requests per hour)
        if len(validRequests) >= 3 {
            return true
        }
    }
    
    // Add current request
    ipRequests[ip] = append(ipRequests[ip], now)
    return false
}

func getClientIP(r *http.Request) string {
    // Check X-Forwarded-For header first
    if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
        return xff
    }
    // Check X-Real-IP header
    if xri := r.Header.Get("X-Real-IP"); xri != "" {
        return xri
    }
    // Fallback to RemoteAddr
    return r.RemoteAddr
}

func main() {
    _ = godotenv.Load()

    defaultApiKey := os.Getenv("MISTRAL_API_KEY")
    if defaultApiKey == "" {
        log.Fatal("MISTRAL_API_KEY is not set")
    }

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
        if apiKeyToUse == "" {
            // Using default API key - check rate limiting
            clientIP := getClientIP(r)
            if isRateLimited(clientIP) {
                http.Error(w, "Rate limit exceeded. Please sign in to continue.", http.StatusTooManyRequests)
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
            http.Error(w, "Failed to get response from AI", http.StatusInternalServerError)
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
            http.Error(w, "Failed to encode response", http.StatusInternalServerError)
            return
        }
    })

    log.Println("Backend running on :8080")
    if err := http.ListenAndServe(":8080", nil); err != nil {
        log.Fatalf("Server failed: %v", err)
    }
}