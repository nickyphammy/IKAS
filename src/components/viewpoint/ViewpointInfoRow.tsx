import type { ReactNode } from 'react'
import { ClockIcon, TagIcon, WalkIcon } from './ViewpointInfoIcons'

type ViewpointInfoRowProps = {
  icon: 'clock' | 'tag' | 'walk'
  children: ReactNode
  className?: string
}

function InfoIcon({ icon }: { icon: ViewpointInfoRowProps['icon'] }) {
  switch (icon) {
    case 'clock':
      return <ClockIcon />
    case 'tag':
      return <TagIcon />
    case 'walk':
      return <WalkIcon />
  }
}

export default function ViewpointInfoRow({
  icon,
  children,
  className = '',
}: ViewpointInfoRowProps) {
  return (
    <div className={`flex items-start gap-4 ${className}`}>
      <div className="mt-0.5">
        <InfoIcon icon={icon} />
      </div>
      <div className="min-w-0 text-2xl leading-normal text-black">{children}</div>
    </div>
  )
}
