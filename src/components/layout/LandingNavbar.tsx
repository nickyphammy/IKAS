import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { APP_NAME, APP_TAGLINE } from '@/lib/constants'

export function LandingNavbar() {
  return (
    <header className="flex items-center justify-between px-4 py-5 md:px-8">
      <Link to="/" className="flex flex-col">
        <span className="text-xl font-bold tracking-tight text-slate-900">{APP_NAME}</span>
        <span className="text-xs font-medium uppercase tracking-widest text-brand">
          {APP_TAGLINE}
        </span>
      </Link>
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link to="/login">Log in</Link>
        </Button>
        <Button asChild>
          <Link to="/signup">Sign up</Link>
        </Button>
      </div>
    </header>
  )
}
