import { Link } from 'react-router-dom'
import { asset } from '../../lib/asset'
import Button from '../ui/Button'

export default function Navbar() {
  return (
    <header className="relative z-20 w-full pt-2.5">
      <nav className="flex min-h-[79px] flex-wrap items-center justify-center gap-4 rounded-lg border border-black bg-[#fff7ef] px-4 py-3 sm:justify-between sm:px-8 sm:py-0">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={asset('assets/landing/logo.svg')}
            alt=""
            className="h-10 w-11 shrink-0"
          />
          <span className="text-xl text-black sm:text-2xl">ikas</span>
        </Link>

        <div className="hidden items-center gap-6 text-xl text-black md:flex lg:gap-10 lg:text-2xl">
          <Link to="/explore" className="hover:opacity-70">
            explore
          </Link>
          <a href="#about" className="hover:opacity-70">
            about
          </a>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <Button
            to="/signup"
            variant="accent"
            className="hidden px-5 py-2 text-2xl sm:inline-flex"
          >
            sign up
          </Button>
          <Link to="/signup" className="text-xl text-black hover:opacity-70 sm:text-2xl">
            log in
          </Link>
        </div>
      </nav>
    </header>
  )
}
