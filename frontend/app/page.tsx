'use client'

import Chat from '@/components/Chat'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { useRouter } from 'next/navigation'

console.log(`
▗▖  ▗▖▗▄▄▄▖ ▗▄▄▖▗▄▄▄▖▗▄▄▖  ▗▄▖ ▗▖        ▗▄▖ ▗▄▄▄▖
▐▛▚▞▜▌  █  ▐▌     █  ▐▌ ▐▌▐▌ ▐▌▐▌       ▐▌ ▐▌  █  
▐▌  ▐▌  █   ▝▀▚▖  █  ▐▛▀▚▖▐▛▀▜▌▐▌       ▐▛▀▜▌  █  
▐▌  ▐▌▗▄█▄▖▗▄▄▞▘  █  ▐▌ ▐▌▐▌ ▐▌▐▙▄▄▖    ▐▌ ▐▌▗▄█▄▖                                  
                                                  
Please take my application into consideration :)
`)

export default function Home() {
  const router = useRouter()

  const onLogin = () => {
    router.push('/auth')
  }
  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden rounded-lg pointer-events-none">
      <Header onLogin={onLogin} />
      <Chat showRateLimitInfo={true} />
      <Footer />
    </div>
  )
}
