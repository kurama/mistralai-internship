'use client'

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Chat from '@/components/Chat'

export default function ChatPage() {
  const { status } = useSession()
  const router = useRouter()

  const onLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden rounded-lg">
      <Header onLogout={onLogout} />
      <Chat showApiKeyInput={true} />
      <Footer />
    </div>
  )
}
