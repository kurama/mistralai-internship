import { useState, useCallback, useEffect } from 'react'
import { chatService, ApiError } from '@/lib/api'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

export interface UseChatReturn {
  message: string
  setMessage: (message: string) => void
  response: string | null
  isLoading: boolean
  error: string | null
  sendMessage: (customApiKey?: string) => Promise<void>
  clearResponse: () => void
  apiKey: string
  setApiKey: (key: string) => void
  showRateLimitWarning: boolean
}

export function useChat(): UseChatReturn {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState('')
  const [showRateLimitWarning, setShowRateLimitWarning] = useState(false)
  const { data: session, status } = useSession()

  // Load API key when user is authenticated
  useEffect(() => {
    const loadApiKey = async () => {
      if (status === 'authenticated' && session?.user) {
        try {
          const savedApiKey = await chatService.getApiKey()
          if (savedApiKey) {
            setApiKey(savedApiKey)
          }
        } catch (error) {
          console.error('Failed to load API key:', error)
        }
      }
    }

    loadApiKey()
  }, [status, session])

  const sendMessage = useCallback(
    async (customApiKey?: string) => {
      if (!message.trim() || isLoading) return

      setIsLoading(true)
      setError(null)

      try {
        const keyToUse = customApiKey || apiKey
        const result = await chatService.sendMessage(message.trim(), keyToUse)
        setResponse(result.reply)
        setMessage('')
        setShowRateLimitWarning(false) // Reset warning on success

        // Save API key if request was successful and user is authenticated
        if (keyToUse && status === 'authenticated' && session?.user) {
          try {
            await chatService.saveApiKey(keyToUse)
          } catch (error) {
            console.error('Failed to save API key:', error)
          }
        }
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.code === 'RATE_LIMIT_EXCEEDED') {
            setError('Rate limit exceeded. Please sign in to continue.')
            setShowRateLimitWarning(true)
            toast.error('Rate limit exceeded. Please sign in to continue.')
          } else if (err.code === 'INVALID_API_KEY') {
            setError('Invalid API key. Please check your Mistral API key and try again.')
            toast.error('Invalid API key. Please check your Mistral API key and try again.')
          } else {
            setError(err.message)
            toast.error(err.message)
          }
        } else {
          setError('An unexpected error occurred')
          toast.error('An unexpected error occurred')
        }

        console.error('Chat error:', err)
      } finally {
        setIsLoading(false)
      }
    },
    [message, isLoading, apiKey, status, session]
  )

  const clearResponse = useCallback(() => {
    setResponse(null)
    setError(null)
    setShowRateLimitWarning(false)
  }, [])

  return {
    message,
    setMessage,
    response,
    isLoading,
    error,
    sendMessage,
    clearResponse,
    apiKey,
    setApiKey,
    showRateLimitWarning,
  }
}
