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
    : 'hover:-translate-y-0.5 hover:opacity-70'
}

export default function AppNavBar() {
  return (
    <header className="relative z-20 mx-auto w-full max-w-[1436px] px-4 pt-2 sm:px-6 lg:px-8">
      <nav className="flex h-16 min-w-0 items-center gap-3 rounded-[40px] bg-[#fff7ef] px-4 sm:gap-6 sm:px-7 lg:gap-9 lg:px-9">
        <Link to="/home" className="motion-press shrink-0 rounded-full">
          <img
            src={asset('assets/nav/logo.svg')}
            alt="ikas"
            className="h-8 w-9"
          />
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-center gap-4 text-[16px] text-black sm:gap-8 lg:gap-14">
          {navItems.map(({ id, label, to }) => (
            <NavLink
              key={id}
              to={to}
              className={({ isActive }) =>
                `inline-block whitespace-nowrap transition duration-200 ${navLinkClass(isActive)}`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <NavLink
          to="/add-viewpoint"
          className={({ isActive }) =>
            `motion-press shrink-0 rounded-[32px] bg-[#ff9e43] px-3 py-1.5 text-[16px] text-black hover:bg-[#ff8f2a] sm:px-5 lg:px-6 ${isActive ? 'underline decoration-from-font underline-offset-4' : ''}`
          }
        >
          add viewpoint
        </NavLink>
      </nav>
    </header>
  )
}
