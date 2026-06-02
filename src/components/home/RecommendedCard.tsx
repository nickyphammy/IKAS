import { Link } from 'react-router-dom'
import RatingBadge from './RatingBadge'

const VIEWPOINT_PATH = '/viewpoint'

export type RecommendedCardProps = {
  image: string
  alt: string
  name: string
  rating: string
  description: string
}

export default function RecommendedCard({
  image,
  alt,
  name,
  rating,
  description,
}: RecommendedCardProps) {
  return (
    <article className="relative h-[244px] w-[260px] shrink-0 overflow-hidden rounded-[40px] sm:h-[260px] sm:w-[289px]">
      <Link to={VIEWPOINT_PATH} className="block size-full">
        <img src={image} alt={alt} className="size-full object-cover" />
      </Link>

      <div className="pointer-events-none absolute right-4 top-4">
        <RatingBadge rating={rating} compact />
      </div>

      <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center px-4">
        <Link
          to={VIEWPOINT_PATH}
          className="w-full max-w-[220px] rounded-2xl bg-white/75 px-3 py-2.5 shadow-sm backdrop-blur-sm transition-opacity hover:bg-white/85 sm:max-w-[240px]"
        >
          <h3 className="mb-1 text-base font-bold leading-tight text-black sm:text-lg">
            {name}
          </h3>
          <p className="line-clamp-2 text-sm leading-snug text-black/80">
            {description}
          </p>
        </Link>
      </div>
    </article>
  )
}

export { VIEWPOINT_PATH }
