'use client'

import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

const errorMessages: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: 'Server Configuration Error',
    description: 'There is a problem with the server configuration. Please contact support.',
  },
  AccessDenied: {
    title: 'Access Denied',
    description: 'You do not have permission to sign in with this account.',
  },
  Verification: {
    title: 'Verification Error',
    description: 'The verification token has expired or has already been used.',
  },
  Default: {
    title: 'Authentication Error',
    description: 'An error occurred during authentication. Please try again.',
  },
  OAuthSignin: {
    title: 'OAuth Sign-in Error',
    description: 'There was an error signing in with the OAuth provider.',
  },
  OAuthCallback: {
    title: 'OAuth Callback Error',
    description: 'There was an error during the OAuth callback.',
  },
  OAuthCreateAccount: {
    title: 'Account Creation Error',
    description: 'Could not create OAuth account in the database.',
  },
  EmailCreateAccount: {
    title: 'Email Account Error',
    description: 'Could not create email account in the database.',
  },
  Callback: {
    title: 'Callback Error',
    description: 'There was an error in the OAuth callback handler.',
  },
  OAuthAccountNotLinked: {
    title: 'Account Not Linked',
    description: 'This account is not linked to your profile. Please sign in with your original provider.',
  },
  EmailSignin: {
    title: 'Email Sign-in Error',
    description: 'Check your email address and try again.',
  },
  CredentialsSignin: {
    title: 'Invalid Credentials',
    description: 'The credentials you provided are invalid.',
  },
  SessionRequired: {
    title: 'Session Required',
    description: 'You must be signed in to access this page.',
  },
}

export default function AuthError() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const errorParam = searchParams.get('error')
    setError(errorParam)
  }, [searchParams])

  const onHome = () => {
    router.push('/')
  }

  const onRetry = () => {
    router.push('/auth')
  }

  const errorInfo = errorMessages[error || 'Default'] || errorMessages.Default

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
        <div className="flex flex-col gap-6 z-10">
          <Card className="border-destructive/20">
            <CardHeader className="text-center">
              <CardTitle className="text-destructive">{errorInfo.title}</CardTitle>
              <CardDescription>{errorInfo.description}</CardDescription>
              {error && <div className="mt-2 text-xs text-muted-foreground">Error code: {error}</div>}
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={onHome} className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
