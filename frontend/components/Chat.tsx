'use client'

import { motion } from 'framer-motion'
import ChatInput from './ChatInput'

interface ChatProps {
  showApiKeyInput?: boolean
  showRateLimitInfo?: boolean
}

export default function Chat({ showApiKeyInput = false, showRateLimitInfo = false }: ChatProps) {
  return (
    <motion.main
      className="z-10 flex flex-col items-center justify-start p-4"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.8,
        ease: 'easeOut',
        delay: 0.3,
      }}
    >
      {showRateLimitInfo && (
        <motion.div
          className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-200"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          You have 3 free messages.{' '}
          <a href="/auth" className="underline hover:text-yellow-100">
            Sign in
          </a>{' '}
          for unlimited access with your API key.
        </motion.div>
      )}
      <ChatInput showApiKeyInput={showApiKeyInput} />
    </motion.main>
  )
}
