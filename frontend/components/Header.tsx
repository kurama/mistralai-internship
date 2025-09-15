'use client'

import { motion } from 'framer-motion'
import { LogOut, LogIn, House } from 'lucide-react'
import Navigation from './Navigation'
import { Button } from './ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { Badge } from './ui/badge'
import { Sparkles } from 'lucide-react'

interface HeaderProps {
  onLogout?: () => void
  onLogin?: () => void
  onHome?: () => void
}

export default function Header({ onLogout, onLogin, onHome }: HeaderProps) {
  return (
    <motion.header
      className="z-10 absolute top-0 p-4 flex flex-row justify-end sm:justify-between items-center w-full"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.8,
        ease: 'easeOut',
      }}
    >
      <motion.div
        className="flex-row gap-4 items-center hidden sm:flex"
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 0.6,
          ease: 'easeOut',
          delay: 0.2,
        }}
      >
        <Badge variant="outline" className="flex flex-row gap-1 items-center">
          <Sparkles size={12} />
          Mistral AI Application
        </Badge>
      </motion.div>

      <div className="flex flex-row gap-4 items-center">
        <Navigation />

        {onLogin && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.6,
              ease: 'easeOut',
              delay: 1,
            }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="pointer-events-auto cursor-pointer" onClick={onLogin}>
                  <LogIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sign In</TooltipContent>
            </Tooltip>
          </motion.div>
        )}

        {onLogout && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.6,
              ease: 'easeOut',
              delay: 1,
            }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="pointer-events-auto cursor-pointer" onClick={onLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Logout</TooltipContent>
            </Tooltip>
          </motion.div>
        )}

        {onHome && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.6,
              ease: 'easeOut',
              delay: 1,
            }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="pointer-events-auto cursor-pointer" onClick={onHome}>
                  <House className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Home</TooltipContent>
            </Tooltip>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}
