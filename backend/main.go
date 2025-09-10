package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/gage-technologies/mistral-go"
	"github.com/joho/godotenv"
)

type ChatRequest struct {
	Message string `json:"message"`
}

type ChatResponse struct {
	Reply string `json:"reply"`
}

func main() {
	// Load the .env file
	_ = godotenv.Load()

	apiKey := os.Getenv("MISTRAL_API_KEY")
	if apiKey == "" {
		log.Fatal("MISTRAL_API_KEY is not set")
	}

	client := mistral.NewMistralClientDefault(apiKey)

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	http.HandleFunc("/chat", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var req ChatRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		chatRes, err := client.Chat(
			"mistral-tiny",
			[]mistral.ChatMessage{{Content: req.Message, Role: mistral.RoleUser}},
			nil,
		)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		reply := ""
		if len(chatRes.Choices) > 0 {
			reply = chatRes.Choices[0].Message.Content
		}

		resp := ChatResponse{Reply: reply}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
	})

	log.Println("Backend running on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
