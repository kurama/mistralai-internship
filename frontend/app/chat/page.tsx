'use client'

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Chat from '@/components/Chat'
import Loading from '@/components/Loading'

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
    return <Loading />
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden rounded-lg pointer-events-none">
      <Header onLogout={onLogout} />
      <Chat showApiKeyInput={true} />
      <Footer />
    </div>
  )
}
