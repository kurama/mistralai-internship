'use client'

import { motion } from 'framer-motion'
import { LogOut } from 'lucide-react'
import Navigation from './Navigation'
import { Button } from './ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { useSession } from 'next-auth/react'

interface HeaderProps {
  onLogout: () => void
}

export default function Header({ onLogout }: HeaderProps) {
  const { data: session } = useSession()

  return (
    <header className="z-10 absolute top-0 p-4 flex sm:flex-row flex-col gap-4 justify-between w-full">
      <motion.div className="flex flex-row gap-4 items-center" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
            delay: 0.2,
          }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={'outline'} size={'icon'} asChild onClick={onLogout}>
                <div>
                  <LogOut color="white" className="w-4 h-4" />
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Log Out</p>
            </TooltipContent>
          </Tooltip>
        </motion.div>
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
            delay: 0.4,
          }}
        >
          {session?.user?.email && <p className="text-sm">{session.user.email}</p>}
        </motion.div>
      </motion.div>
      <Navigation />
    </header>
  )
}
