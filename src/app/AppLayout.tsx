import { Outlet } from 'react-router-dom'
import { AppNavBar } from '@/components/layout/AppNavBar'
import { PageShell } from '@/components/layout/PageShell'

export function AppLayout() {
  return (
    <PageShell withNav>
      <AppNavBar />
      <Outlet />
    </PageShell>
  )
}
