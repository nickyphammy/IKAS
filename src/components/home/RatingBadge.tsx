import { asset } from '../../lib/asset'

type RatingBadgeProps = {
  rating: string
  compact?: boolean
}

export default function RatingBadge({ rating, compact }: RatingBadgeProps) {
  return (
    <div
      className={`inline-flex shrink-0 items-center rounded-[32px] bg-white/85 ${
        compact ? 'gap-1 px-2 py-0.5' : 'gap-1 px-2.5 py-1'
      }`}
    >
      <img
        src={asset('assets/home/star.png')}
        alt=""
        className={compact ? 'size-4' : 'size-4'}
        aria-hidden
      />
      <span
        className="text-[16px] font-bold text-black"
      >
        {rating}
      </span>
    </div>
  )
}
