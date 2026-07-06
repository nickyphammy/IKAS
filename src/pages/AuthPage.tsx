import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/auth-context'
import { getSupabaseConfigError } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageContainer, PageShell } from '@/components/layout/PageShell'
import { APP_NAME, APP_TAGLINE } from '@/lib/constants'

interface AuthFormProps {
  mode: 'login' | 'signup'
}

export default function AuthPage({ mode }: AuthFormProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/home'
  const { signIn, signUp, signInWithGoogle, isConfigured } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isLogin = mode === 'login'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (!isConfigured) {
        setError(getSupabaseConfigError() ?? 'Supabase is not configured. Save .env and restart the dev server.')
        return
      }
      if (isLogin) {
        await signIn(email, password)
      } else {
        await signUp(email, password)
      }
      navigate(redirectTo)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError(null)
    try {
      if (!isConfigured) {
        setError('Supabase is not configured')
        return
      }
      await signInWithGoogle()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed')
    }
  }

  return (
    <PageShell className="flex min-h-screen items-center justify-center">
      <PageContainer className="max-w-md py-12">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-2xl font-bold">{APP_NAME}</h1>
            <p className="text-xs uppercase tracking-widest text-brand">{APP_TAGLINE}</p>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{isLogin ? 'Welcome back' : 'Create your account'}</CardTitle>
            <CardDescription>
              {isLogin
                ? 'Sign in to save spots and share viewpoints'
                : 'Join explorers sharing hidden scenic spots'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>
              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Please wait…' : isLogin ? 'Log in' : 'Sign up'}
              </Button>
            </form>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted">Or continue with</span>
              </div>
            </div>
            <Button variant="secondary" className="w-full" onClick={handleGoogle} type="button">
              Continue with Google
            </Button>
            <p className="mt-6 text-center text-sm text-muted">
              {isLogin ? (
                <>
                  Don&apos;t have an account?{' '}
                  <Link to="/signup" className="font-semibold text-brand hover:underline">
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-brand hover:underline">
                    Log in
                  </Link>
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </PageContainer>
    </PageShell>
  )
}
