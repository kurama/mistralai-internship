import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Github } from 'lucide-react'

interface LoginFormProps {
  className?: string
  onLogin: () => void
}

export function LoginForm({ className, onLogin }: LoginFormProps) {
  return ( 
    <div className={cn('flex flex-col gap-6 z-10 pointer-events-auto', className)}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Sign in to your account</CardTitle>
          <CardDescription>Connect with your GitHub account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <Button variant="outline" className="w-full" type="button" onClick={onLogin}>
                  Continue with GitHub <Github />
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
