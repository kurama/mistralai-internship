'use client'

import { motion } from 'framer-motion'
import { LogOut, LogIn } from 'lucide-react'
import Navigation from './Navigation'
import { Button } from './ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { useSession } from 'next-auth/react'
import { Badge } from './ui/badge'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'

interface HeaderProps {
  onLogout?: () => void
  showAuthButton?: boolean
}

export default function Header({ onLogout, showAuthButton = false }: HeaderProps) {
  return (
    <motion.header
      className="z-10 absolute top-0 p-4 flex flex-row justify-between items-center w-full"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.8,
        ease: 'easeOut',
      }}
    >
      <motion.div
        className="flex flex-row gap-4 items-center"
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

        {showAuthButton && (
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
                <Link href="/auth">
                  <Button variant="outline" size="icon">
                    <LogIn className="h-4 w-4" />
                  </Button>
                </Link>
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
                <Button variant="outline" size="icon" onClick={onLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Logout</TooltipContent>
            </Tooltip>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}
