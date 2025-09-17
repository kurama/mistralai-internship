'use client'

import { LoginForm } from '@/components/LoginForm'
import { motion } from 'framer-motion'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Header from '@/components/Header'
import Loading from '@/components/Loading'

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

  const onHome = () => {
    router.push('/')
  }

  if (status === 'loading') {
    return <Loading />
  }

  if (status === 'authenticated') {
    return null
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 pointer-events-none">
      <Header onHome={onHome} />
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
