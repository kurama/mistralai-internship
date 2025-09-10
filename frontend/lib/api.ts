const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export interface ChatRequest {
  message: string
}

export interface ChatResponse {
  reply: string
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export const chatService = {
  async sendMessage(message: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message } as ChatRequest),
      })

      if (!response.ok) {
        throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`)
      }

      const data: ChatResponse = await response.json()
      return data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      // Network or other errors
      throw new ApiError(0, error instanceof Error ? error.message : 'Network error')
    }
  },

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/health`)
      return response.ok
    } catch {
      return false
    }
  },
}
