import { Link } from 'react-router-dom'

const navItems = [
  { id: 'home', label: 'home', to: '/home' },
  { id: 'explore', label: 'explore', to: '/explore' },
  { id: 'saved', label: 'saved', to: '/saved' },
] as const

export type AppNavActiveItem = (typeof navItems)[number]['id']

type AppNavBarProps = {
  active?: AppNavActiveItem
}

function navLinkClass(isActive: boolean) {
  return isActive
    ? 'underline decoration-from-font underline-offset-4'
    : 'hover:opacity-70'
}

export default function AppNavBar({ active = 'home' }: AppNavBarProps) {
  return (
    <header className="relative z-20 mx-auto w-full max-w-[1432px] px-4 pt-2.5">
      <nav className="flex h-[75px] items-center gap-6 rounded-[64px] bg-[#fff7ef] px-6 sm:px-10 lg:gap-10 lg:px-11">
        <Link to="/home" className="shrink-0">
          <img
            src="/assets/nav/logo.svg"
            alt="ikas"
            className="h-10 w-11"
          />
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-center gap-6 text-2xl text-black sm:gap-10 lg:gap-14">
          {navItems.map(({ id, label, to }) => (
            <Link
              key={id}
              to={to}
              className={`whitespace-nowrap ${navLinkClass(active === id)}`}
            >
              {label}
            </Link>
          ))}
        </div>

        <Link
          to="/add-viewpoint"
          className="shrink-0 rounded-[40px] bg-[#ff9e43] px-5 py-2 text-2xl text-black hover:bg-[#ff8f2a] sm:px-6"
        >
          add viewpoint
        </Link>
      </nav>
    </header>
  )
}
