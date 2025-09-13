import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import SessionProviderWrapper from '@/components/SessionProviderWrapper'
import { InteractiveGridPattern } from '@/components/magicui/interactive-grid-pattern'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Mistral Internship Application - Dorian Grasset',
  description: 'A simple Next.js app for Mistral internship application',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden rounded-lg`}>
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
        <InteractiveGridPattern
          className={cn('[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]', 'absolute inset-0 h-full w-full -z-50')}
          squares={[50, 50]}
          width={50}
          height={50}
          squaresClassName="hover:fill-secondary"
        />
        <Toaster />
      </body>
    </html>
  )
}
