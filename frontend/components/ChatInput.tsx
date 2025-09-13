'use client'

import { motion } from 'framer-motion'
import { AutosizeTextarea } from '@/components/ui/autosizetextarea'
import { Button } from '@/components/ui/button'
import { Send, LoaderCircle, RotateCcw, Info } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import { Input } from './ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { useSession } from 'next-auth/react'

interface ChatInputProps {
  showApiKeyInput?: boolean
}

export default function ChatInput({ showApiKeyInput = false }: ChatInputProps) {
  const { message, setMessage, response, isLoading, error, sendMessage, clearResponse, apiKey, setApiKey } = useChat()

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    await sendMessage()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <>
      {/* Response bubble */}
      {response && !error && (
        <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.3, ease: 'easeOut' }} className="p-4 rounded-2xl">
          <div className="thought">
            <div className="text-background whitespace-pre-wrap">{response}</div>
          </div>
        </motion.div>
      )}

      {/* Error display */}
      {error && (
        <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.3, ease: 'easeOut' }} className="p-4 rounded-2xl">
          <div className="mb-4 p-3 bg-red-500/10 border text-sm border-red-500/20 rounded-lg text-red-200">{error}</div>
        </motion.div>
      )}

      <motion.img
        src="cat.gif"
        alt="Mistral Cat"
        height={256}
        width={256}
        whileHover={{
          scale: 1.05,
          rotate: [0, -2, 2, -2, 0],
          transition: { duration: 0.5 },
        }}
        className="cursor-pointer"
      />

      {/* Input area */}
      <form onSubmit={handleSubmit} className="bg-muted p-4 flex flex-col rounded-2xl gap-4 w-full sm:w-[400px] md:w-[600px]">
        <AutosizeTextarea
          placeholder="Ask anything"
          className="w-full border-0 bg-muted text-white resize-none"
          maxHeight={200}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />

        <div className="w-full flex justify-end gap-4">
          {showApiKeyInput && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={!isLoading ? { scale: 1.05 } : {}} whileTap={!isLoading ? { scale: 0.95 } : {}}>
                    <Button variant="outline" size="icon" type="button">
                      <Info className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>Enter your Mistral API key for unlimited access</TooltipContent>
              </Tooltip>
              <Input placeholder="Enter your Mistral API key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} type="password" />
            </>
          )}
          {/* Clear/Refresh button */}
          {(response || error) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="icon" onClick={clearResponse} disabled={isLoading}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>Reset chat</TooltipContent>
            </Tooltip>
          )}

          {/* Send button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div whileHover={!isLoading ? { scale: 1.05 } : {}} whileTap={!isLoading ? { scale: 0.95 } : {}}>
                <Button type="submit" variant="default" size="icon" disabled={isLoading || !message.trim()}>
                  {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>Send chat</TooltipContent>
          </Tooltip>
        </div>
      </form>
    </>
  )
}
