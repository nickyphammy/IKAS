import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/app/auth-context'
import { AppNavBar } from '@/components/layout/AppNavBar'
import { PageShell } from '@/components/layout/PageShell'
import { Skeleton } from '@/components/ui/skeleton'

export function ProtectedRoute() {
  const { user, loading, isConfigured } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <PageShell className="p-8">
        <Skeleton className="mx-auto h-12 max-w-md" />
        <Skeleton className="mx-auto mt-4 h-64 max-w-2xl" />
      </PageShell>
    )
  }

  if (!isConfigured) {
    return (
      <PageShell withNav>
        <AppNavBar />
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <h2 className="text-xl font-semibold">Supabase not connected</h2>
          <p className="mt-2 text-sm text-muted">
            Add your Supabase URL and anon key to <code>.env</code> to enable auth and data.
            The UI is fully functional with empty states until then.
          </p>
        </div>
        <Outlet />
      </PageShell>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return (
    <PageShell withNav>
      <AppNavBar />
      <Outlet />
    </PageShell>
  )
}
