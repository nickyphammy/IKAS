import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/app/auth-context'
import { ProtectedRoute } from '@/app/ProtectedRoute'
import AddViewpointPage from '@/pages/AddViewpointPage'
import AuthPage from '@/pages/AuthPage'
import AuthCallbackPage from '@/pages/AuthCallbackPage'
import DailyRecsPage from '@/pages/DailyRecsPage'
import ExplorePage from '@/pages/ExplorePage'
import HomePage from '@/pages/HomePage'
import LandingPage from '@/pages/LandingPage'
import SavedPage from '@/pages/SavedPage'
import ViewpointPage from '@/pages/ViewpointPage'
import { AppNavBar } from '@/components/layout/AppNavBar'
import { PageShell } from '@/components/layout/PageShell'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
})

function PublicExploreLayout() {
  return (
    <PageShell withNav>
      <AppNavBar />
      <ExplorePage />
    </PageShell>
  )
}

function PublicViewpointLayout() {
  return (
    <PageShell withNav={false}>
      <header className="flex h-16 items-center justify-between border-b border-border bg-white px-6">
        <a href="/" className="text-lg font-bold text-slate-900">
          IKAS
        </a>
        <a href="/login" className="text-sm font-medium text-brand hover:underline">
          Log in
        </a>
      </header>
      <ViewpointPage />
    </PageShell>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/signup" element={<AuthPage mode="signup" />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/explore" element={<PublicExploreLayout />} />
            <Route path="/viewpoint/:id" element={<PublicViewpointLayout />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/daily-recs" element={<DailyRecsPage />} />
              <Route path="/add-viewpoint" element={<AddViewpointPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
