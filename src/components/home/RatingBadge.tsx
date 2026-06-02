import { asset } from '../../lib/asset'

type RatingBadgeProps = {
  rating: string
  compact?: boolean
}

export default function RatingBadge({ rating, compact }: RatingBadgeProps) {
  return (
    <div
      className={`inline-flex shrink-0 items-center rounded-[32px] bg-white/85 ${
        compact ? 'gap-1 px-2 py-0.5' : 'gap-1.5 px-3 py-1.5'
      }`}
    >
      <img
        src={asset('assets/home/star.png')}
        alt=""
        className={compact ? 'size-3.5' : 'size-[18px]'}
        aria-hidden
      />
      <span
        className={`font-bold text-black ${compact ? 'text-sm' : 'text-base'}`}
      >
        {rating}
      </span>
    </div>
  )
}
