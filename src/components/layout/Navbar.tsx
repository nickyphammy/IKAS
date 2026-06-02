import { Link } from 'react-router-dom'
import { asset } from '../../lib/asset'
import Button from '../ui/Button'

export default function Navbar() {
  return (
    <header className="relative z-20 mx-auto w-full max-w-[1436px] px-4 pt-2 sm:px-6 lg:px-8">
      <nav className="flex h-16 min-w-0 items-center justify-between gap-3 rounded-[40px] bg-[#fff7ef] px-4 sm:gap-6 sm:px-7 lg:gap-10 lg:px-9">
        <Link to="/" className="motion-press flex shrink-0 items-center gap-2 rounded-full sm:gap-3">
          <img
            src={asset('assets/landing/logo.svg')}
            alt=""
            className="h-8 w-9 shrink-0"
          />
          <span className="text-[16px] text-black">ikas</span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <Button
            to="/signup"
            variant="accent"
            className="hidden rounded-[32px] px-4 py-1.5 text-[16px] sm:inline-flex sm:px-5 lg:px-6"
          >
            sign up
          </Button>
          <Link
            to="/signup"
            className="inline-block text-[16px] text-black transition duration-200 hover:-translate-y-0.5 hover:opacity-70"
          >
            log in
          </Link>
        </div>
      </nav>
    </header>
  )
}
