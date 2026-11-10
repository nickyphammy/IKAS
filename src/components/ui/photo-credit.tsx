import type { PhotoCredit as PhotoCreditData } from '@/types'
import { cn } from '@/lib/utils'

interface PhotoCreditProps {
  credit: PhotoCreditData
  className?: string
}

/**
 * Full attribution for a freely licensed photo, with links to the source file and the license.
 * CC BY / CC BY-SA require the author, the license and a link to it.
 */
export function PhotoCredit({ credit, className }: PhotoCreditProps) {
  return (
    <p className={cn('text-xs text-muted', className)}>
      Photo:{' '}
      {credit.source_url ? (
        <a
          href={credit.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-brand"
        >
          {credit.author}
        </a>
      ) : (
        credit.author
      )}
      {' · '}
      {credit.license_url ? (
        <a
          href={credit.license_url}
          target="_blank"
          rel="noopener noreferrer license"
          className="underline hover:text-brand"
        >
          {credit.license}
        </a>
      ) : (
        credit.license
      )}
      {credit.source_url ? ' · via Wikimedia Commons' : ''}
    </p>
  )
}

/**
 * Compact text-only credit for photos inside a card that is itself a link (nested links are invalid).
 * The full credit with links is on the viewpoint page the card opens.
 */
export function PhotoCreditOverlay({ credit, className }: PhotoCreditProps) {
  return (
    <span
      className={cn(
        'pointer-events-none absolute bottom-0 left-0 max-w-full truncate rounded-tr-md bg-black/50 px-2 py-0.5 text-[10px] text-white',
        className,
      )}
    >
      Photo: {credit.author} · {credit.license}
    </span>
  )
}
