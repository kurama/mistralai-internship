'use client'

import { motion } from 'framer-motion'
import ChatInput from './chatInput'

export default function MainContent() {
  return (
    <motion.main
      className="z-10 flex flex-col items-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.8,
        ease: 'easeOut',
        delay: 0.3,
      }}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.6,
          ease: 'easeOut',
          delay: 0.6,
        }}
        className="flex flex-col items-center"
      >
        

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
            delay: 0.9,
          }}
        >
          <ChatInput />
        </motion.div>
      </motion.div>
    </motion.main>
  )
}
