import { Link } from 'react-router-dom'
import Button from '../ui/Button'

export default function Navbar() {
  return (
    <header className="relative z-20 mx-auto w-full max-w-[1432px] px-2 pt-2.5">
      <nav className="flex h-[79px] items-center justify-between rounded-lg border border-black bg-[#fff7ef] px-6 sm:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/assets/landing/logo.svg"
            alt=""
            className="h-10 w-11 shrink-0"
          />
          <span className="text-2xl text-black">ikas</span>
        </Link>

        <div className="hidden items-center gap-10 text-2xl text-black md:flex">
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
          <Link to="/signup" className="text-2xl text-black hover:opacity-70">
            log in
          </Link>
        </div>
      </nav>
    </header>
  )
}
