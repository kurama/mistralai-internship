'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Sparkles } from 'lucide-react'
import Navigation from './navigation'

console.log(`
▗▖  ▗▖▗▄▄▄▖ ▗▄▄▖▗▄▄▄▖▗▄▄▖  ▗▄▖ ▗▖        ▗▄▖ ▗▄▄▄▖
▐▛▚▞▜▌  █  ▐▌     █  ▐▌ ▐▌▐▌ ▐▌▐▌       ▐▌ ▐▌  █  
▐▌  ▐▌  █   ▝▀▚▖  █  ▐▛▀▚▖▐▛▀▜▌▐▌       ▐▛▀▜▌  █  
▐▌  ▐▌▗▄█▄▖▗▄▄▞▘  █  ▐▌ ▐▌▐▌ ▐▌▐▙▄▄▖    ▐▌ ▐▌▗▄█▄▖                                  
                                                  
Please take my application into consideration :)
`)

export default function Header() {
  return (
    <div className="z-10 absolute top-0 p-4 flex justify-between w-full">
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
        <Badge className="w-fit h-fit" variant={'outline'}>
          <Sparkles color="white" height={16} width={16} />
          Mistral Internship Application
        </Badge>
      </motion.div>
      <Navigation />
    </div>
  )
}
