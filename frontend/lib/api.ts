const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export interface ChatRequest {
  message: string
  apiKey?: string
}

export interface ChatResponse {
  reply: string
}

export interface ErrorResponse {
  error: string
  code?: string
}

export class ApiError extends Error {
  constructor(public status: number, message: string, public code?: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export const chatService = {
  async sendMessage(message: string, apiKey?: string): Promise<ChatResponse> {
    try {
      const body: ChatRequest = { message }
      if (apiKey) {
        body.apiKey = apiKey
      }

      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const contentType = response.headers.get('content-type')

        if (contentType && contentType.includes('application/json')) {
          const errorData: ErrorResponse = await response.json()
          throw new ApiError(response.status, errorData.error, errorData.code)
        } else {
          throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`)
        }
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

  async saveApiKey(apiKey: string): Promise<void> {
    try {
      const response = await fetch('/api/user/api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      })

      if (!response.ok) {
        throw new Error('Failed to save API key')
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to save API key')
    }
  },

  async getApiKey(): Promise<string | null> {
    try {
      const response = await fetch('/api/user/api-key')

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      return data.apiKey
    } catch (error) {
      console.error('Error fetching API key:', error)
      return null
    }
  },
}
