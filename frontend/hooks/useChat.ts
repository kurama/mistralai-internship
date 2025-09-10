import { useState, useCallback } from 'react'
import { chatService, ApiError } from '@/lib/api'
import { toast } from 'sonner'

export interface UseChatReturn {
  message: string
  setMessage: (message: string) => void
  response: string | null
  isLoading: boolean
  error: string | null
  sendMessage: () => Promise<void>
  clearResponse: () => void
}

export function useChat(): UseChatReturn {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async () => {
    if (!message.trim() || isLoading) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await chatService.sendMessage(message.trim())
      setResponse(result.reply)
      setMessage('') // Clear input after successful response
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Error ${err.status}: ${err.message}`)
      } else {
        setError('An unexpected error occurred')
      }
      toast.error(error || 'An unexpected error occurred')

      console.error('Chat error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [message, isLoading])

  const clearResponse = useCallback(() => {
    setResponse(null)
    setError(null)
  }, [])

  return {
    message,
    setMessage,
    response,
    isLoading,
    error,
    sendMessage,
    clearResponse,
  }
}
