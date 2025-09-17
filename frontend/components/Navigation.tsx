'use client'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { motion } from 'framer-motion'
import { BookOpenText, Github } from 'lucide-react'

const navigationItems = [
  {
    href: 'https://github.com/kurama/mistralai-internship',
    icon: <Github color="white" />,
    tooltip: 'GitHub',
    delay: 0.4,
  },
  {
    href: 'https://docs.mistral.ai/',
    icon: <BookOpenText color="white" />,
    tooltip: 'Documentation',
    delay: 0.6,
  },
  {
    href: 'https://chat.mistral.ai/chat',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 298.24155 298.24154" width="20" height="20" fill="white">
        <polygon
          points="242.424,90.909 242.424,121.212 212.121,121.212 212.121,151.515 181.818,151.515 181.818,121.212 151.515,121.212 151.515,90.909 121.212,90.909 121.212,212.121 90.909,212.121 90.909,242.424 181.818,242.424 181.818,212.121 151.515,212.121 151.515,181.818 181.818,181.818 181.818,212.121 212.121,212.121 212.121,181.818 242.424,181.818 242.424,212.121 212.121,212.121 212.121,242.424 303.03,242.424 303.03,212.121 272.727,212.121 272.727,90.909"
          transform="translate(-47.848728,-17.545727)"
        />
      </svg>
    ),
    tooltip: 'Le Chat',
    delay: 0.8,
  },
]

export default function Navigation() {
  return (
    <nav className="flex gap-4">
      {navigationItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
            delay: item.delay,
          }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={'outline'} size={'icon'} className="pointer-events-auto" asChild>
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  {item.icon}
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{item.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </motion.div>
      ))}
    </nav>
  )
}
