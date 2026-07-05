import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSupabase } from '@/lib/supabase'
import { PageShell } from '@/components/layout/PageShell'
import { Skeleton } from '@/components/ui/skeleton'

export default function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const supabase = getSupabase()
    if (!supabase) {
      navigate('/login')
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      navigate(session ? '/home' : '/login')
    })
  }, [navigate])

  return (
    <PageShell className="flex min-h-screen items-center justify-center p-8">
      <div className="text-center">
        <Skeleton className="mx-auto h-8 w-48" />
        <p className="mt-4 text-sm text-muted">Signing you in…</p>
      </div>
    </PageShell>
  )
}
