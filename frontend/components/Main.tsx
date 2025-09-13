'use client'

import { motion } from 'framer-motion'
import ChatInput from './ChatInput'

export default function Main() {
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
      <ChatInput />
    </motion.main>
  )
}
