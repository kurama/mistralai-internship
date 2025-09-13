'use client'

import { LoginForm } from '@/components/LoginForm'
import { motion } from 'framer-motion'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { InteractiveGridPattern } from '@/components/magicui/interactive-grid-pattern'
import { cn } from '@/lib/utils'

export default function Auth() {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/chat')
    }
  }, [status, router])

  const onLogin = () => {
    signIn('github', { callbackUrl: '/chat' })
  }

  if (status === 'loading') {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'authenticated') {
    return null
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <motion.div
        className="w-full max-w-sm z-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.6,
          ease: 'easeOut',
          delay: 0.2,
        }}
      >
        <LoginForm onLogin={onLogin} />
      </motion.div>
    </div>
  )
}
