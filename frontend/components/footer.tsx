'use client'

import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <motion.footer
      className="z-10 absolute bottom-0 p-4 text-sm text-muted-foreground flex flex-row gap-1"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.8,
        ease: 'easeOut',
        delay: 1.2,
      }}
    >
      Made with 🧡 by{' '}
      <motion.a
        className="hover:underline hover:text-primary"
        href="https://github.com/kurama"
        target="_blank"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300, damping: 10 }}
      >
        Dorian Grasset
      </motion.a>
    </motion.footer>
  )
}
