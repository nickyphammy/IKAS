import { Compass, Heart, Home, LogOut, Plus } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/app/auth-context'
import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/saved', label: 'Saved', icon: Heart },
]

export function AppNavBar() {
  const location = useLocation()
  const { signOut } = useAuth()

  return (
    <>
      <header className="sticky top-0 z-40 hidden border-b border-border bg-white/90 backdrop-blur md:block">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/home" className="text-lg font-bold text-slate-900">
            {APP_NAME}
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors',
                  location.pathname.startsWith(to)
                    ? 'bg-brand-light text-brand'
                    : 'text-slate-600 hover:bg-slate-100',
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild size="sm">
              <Link to="/add-viewpoint">
                <Plus className="h-4 w-4" />
                Add spot
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => signOut()} aria-label="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-white/95 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex flex-col items-center gap-0.5 rounded-xl px-4 py-2 text-xs font-medium',
                location.pathname.startsWith(to) ? 'text-brand' : 'text-slate-500',
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
          <Link
            to="/add-viewpoint"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-md"
            aria-label="Add viewpoint"
          >
            <Plus className="h-5 w-5" />
          </Link>
        </div>
      </nav>
    </>
  )
}
