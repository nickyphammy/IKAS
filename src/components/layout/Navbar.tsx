import { Link } from 'react-router-dom'
import { asset } from '../../lib/asset'
import Button from '../ui/Button'

export default function Navbar() {
  return (
    <header className="relative z-20 mx-auto w-full max-w-[1436px] px-4 pt-2.5 sm:px-6 lg:px-8">
      <nav className="flex h-[75px] min-w-0 items-center justify-between gap-3 rounded-[64px] bg-[#fff7ef] px-4 sm:gap-6 sm:px-8 lg:gap-10 lg:px-11">
        <Link to="/" className="flex shrink-0 items-center gap-2 sm:gap-3">
          <img
            src={asset('assets/landing/logo.svg')}
            alt=""
            className="h-9 w-10 shrink-0 sm:h-10 sm:w-11"
          />
          <span className="text-xl text-black sm:text-2xl">ikas</span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <Button
            to="/signup"
            variant="accent"
            className="hidden rounded-[40px] px-4 py-2 text-lg sm:inline-flex sm:px-5 sm:text-xl lg:px-6 lg:text-2xl"
          >
            sign up
          </Button>
          <Link
            to="/signup"
            className="text-lg text-black hover:opacity-70 sm:text-xl lg:text-2xl"
          >
            log in
          </Link>
        </div>
      </nav>
    </header>
  )
}
