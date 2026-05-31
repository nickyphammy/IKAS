import { asset } from '../../lib/asset'

type RatingBadgeProps = {
  rating: string
}

export default function RatingBadge({ rating }: RatingBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-[32px] bg-white/85 px-3 py-1.5">
      <img
        src={asset('assets/home/star.png')}
        alt=""
        className="size-[18px]"
        aria-hidden
      />
      <span className="text-base font-bold text-black">{rating}</span>
    </div>
  )
}
