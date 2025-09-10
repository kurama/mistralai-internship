import MainContent from '@/components/content'
import Footer from '@/components/footer'
import Header from '@/components/header'
import { InteractiveGridPattern } from '@/components/magicui/interactive-grid-pattern'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'

export default function Home() {
  return (
    <>
      <Toaster />
      <div className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden rounded-lg">
        <Header />
        <MainContent />
        <Footer />

        <InteractiveGridPattern
          className={cn('[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]', 'absolute inset-0 h-full w-full')}
          squares={[50, 50]}
          width={50}
          height={50}
          squaresClassName="hover:fill-secondary"
        />
      </div>
    </>
  )
}
