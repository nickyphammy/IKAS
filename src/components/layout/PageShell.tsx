import { cn } from '@/lib/utils'

interface PageShellProps {
  children: React.ReactNode
  className?: string
  withNav?: boolean
}

export function PageShell({ children, className, withNav = false }: PageShellProps) {
  return (
    <div className={cn('min-h-screen bg-surface', withNav && 'pb-20 md:pb-0', className)}>
      {children}
    </div>
  )
}

export function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <main className={cn('mx-auto w-full max-w-6xl px-4 py-8 md:px-6', className)}>
      {children}
    </main>
  )
}
