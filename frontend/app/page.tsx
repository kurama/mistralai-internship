'use client'

import Chat from '@/components/Chat'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { InteractiveGridPattern } from '@/components/magicui/interactive-grid-pattern'
import { cn } from '@/lib/utils'

console.log(`
▗▖  ▗▖▗▄▄▄▖ ▗▄▄▖▗▄▄▄▖▗▄▄▖  ▗▄▖ ▗▖        ▗▄▖ ▗▄▄▄▖
▐▛▚▞▜▌  █  ▐▌     █  ▐▌ ▐▌▐▌ ▐▌▐▌       ▐▌ ▐▌  █  
▐▌  ▐▌  █   ▝▀▚▖  █  ▐▛▀▚▖▐▛▀▜▌▐▌       ▐▛▀▜▌  █  
▐▌  ▐▌▗▄█▄▖▗▄▄▞▘  █  ▐▌ ▐▌▐▌ ▐▌▐▙▄▄▖    ▐▌ ▐▌▗▄█▄▖                                  
                                                  
Please take my application into consideration :)
`)

export default function Home() {
  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden rounded-lg">
      <Header showAuthButton={true} />
      <Chat showRateLimitInfo={true} />
      <Footer />
    </div>
  )
}
