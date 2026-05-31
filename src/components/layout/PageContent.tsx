import type { ReactNode } from 'react'

type PageContentProps = {
  children: ReactNode
  className?: string
}

export default function PageContent({
  children,
  className = '',
}: PageContentProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[1436px] px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </div>
  )
}
