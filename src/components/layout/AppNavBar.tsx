import { Link, NavLink } from 'react-router-dom'
import { asset } from '../../lib/asset'

const navItems = [
  { id: 'home', label: 'home', to: '/home' },
  { id: 'explore', label: 'explore', to: '/explore' },
  { id: 'saved', label: 'saved', to: '/saved' },
] as const

function navLinkClass(isActive: boolean) {
  return isActive
    ? 'underline decoration-from-font underline-offset-4'
    : 'hover:opacity-70'
}

export default function AppNavBar() {
  return (
    <header className="relative z-20 mx-auto w-full max-w-[1436px] px-4 pt-2.5 sm:px-6 lg:px-8">
      <nav className="flex h-[75px] min-w-0 items-center gap-3 rounded-[64px] bg-[#fff7ef] px-4 sm:gap-6 sm:px-8 lg:gap-10 lg:px-11">
        <Link to="/home" className="shrink-0">
          <img
            src={asset('assets/nav/logo.svg')}
            alt="ikas"
            className="h-9 w-10 sm:h-10 sm:w-11"
          />
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-center gap-4 text-lg text-black sm:gap-8 sm:text-xl lg:gap-14 lg:text-2xl">
          {navItems.map(({ id, label, to }) => (
            <NavLink
              key={id}
              to={to}
              className={({ isActive }) =>
                `whitespace-nowrap ${navLinkClass(isActive)}`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <NavLink
          to="/add-viewpoint"
          className={({ isActive }) =>
            `shrink-0 rounded-[40px] bg-[#ff9e43] px-3 py-2 text-lg text-black hover:bg-[#ff8f2a] sm:px-5 sm:text-xl lg:px-6 lg:text-2xl ${isActive ? 'underline decoration-from-font underline-offset-4' : ''}`
          }
        >
          add viewpoint
        </NavLink>
      </nav>
    </header>
  )
}
