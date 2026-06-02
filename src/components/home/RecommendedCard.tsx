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
    <article className="motion-pop group relative h-[208px] w-[232px] shrink-0 overflow-hidden rounded-[24px] sm:h-[232px] sm:w-[264px]">
      <Link to={VIEWPOINT_PATH} className="block size-full">
        <img src={image} alt={alt} className="motion-image size-full object-cover" />
      </Link>

      <div className="pointer-events-none absolute right-3 top-3">
        <RatingBadge rating={rating} compact />
      </div>

      <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center px-3">
        <Link
          to={VIEWPOINT_PATH}
          className="w-full max-w-[208px] rounded-xl bg-white/75 px-3 py-2 shadow-sm backdrop-blur-sm transition duration-200 hover:bg-white/90 sm:max-w-[232px]"
        >
          <h3 className="mb-1 text-[16px] font-bold leading-tight text-black">
            {name}
          </h3>
          <p className="line-clamp-2 text-[16px] leading-snug text-black/80">
            {description}
          </p>
        </Link>
      </div>
    </article>
  )
}

export { VIEWPOINT_PATH }
