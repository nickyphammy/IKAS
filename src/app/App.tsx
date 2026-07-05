import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/app/auth-context'
import { AppLayout } from '@/app/AppLayout'
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
})

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

            <Route element={<AppLayout />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/daily-recs" element={<DailyRecsPage />} />
              <Route path="/viewpoint/:id" element={<ViewpointPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/add-viewpoint" element={<AddViewpointPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
