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
      Made with ♥ by{' '}
      <a className="hover:underline hover:text-primary pointer-events-auto" href="https://github.com/kurama" target="_blank">
        Dorian Grasset
      </a>
    </motion.footer>
  )
}
