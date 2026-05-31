import type { ReactNode } from 'react'
import AppNavBar from './AppNavBar'
import PageContent from './PageContent'

type AppPageShellProps = {
  background: string
  children: ReactNode
  contentClassName?: string
}

export default function AppPageShell({
  background,
  children,
  contentClassName = '',
}: AppPageShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-white" />
        <img
          src={background}
          alt=""
          className="absolute inset-0 size-full object-cover object-center"
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <PageContent>
          <AppNavBar />
        </PageContent>

        <div
          className={`flex flex-1 flex-col items-center pt-6 sm:pt-8 lg:pt-12 ${contentClassName}`}
        >
          <PageContent className="w-full">{children}</PageContent>
        </div>
      </div>
    </main>
  )
}
