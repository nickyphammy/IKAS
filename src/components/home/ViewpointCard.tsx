import { Link } from 'react-router-dom'
import ArrowButton from '../ui/ArrowButton'
import RatingBadge from './RatingBadge'

const VIEWPOINT_PATH = '/viewpoint'

export type ViewpointCardProps = {
  image: string
  title: string
  rating: string
}

function splitTitle(title: string) {
  const [first, ...rest] = title.split(' ')
  return { first, second: rest.join(' ') }
}

export default function ViewpointCard({
  image,
  title,
  rating,
}: ViewpointCardProps) {
  const { first, second } = splitTitle(title)

  return (
    <article className="motion-pop group relative h-[272px] w-[232px] shrink-0 overflow-hidden rounded-[24px] sm:h-[312px] sm:w-[280px]">
      <Link to={VIEWPOINT_PATH} className="block size-full">
        <img src={image} alt={title} className="motion-image size-full object-cover" />
      </Link>
      <div className="pointer-events-none absolute left-5 top-5">
        <RatingBadge rating={rating} />
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/50 to-transparent px-5 pb-5 pt-12">
        <Link
          to={VIEWPOINT_PATH}
          className="text-[16px] leading-tight text-white transition duration-200 hover:opacity-90 group-hover:translate-x-1"
        >
          <span className="block">{first}</span>
          {second ? <span className="block">{second}</span> : null}
        </Link>
        <ArrowButton label={`View ${title}`} to={VIEWPOINT_PATH} />
      </div>
    </article>
  )
}

export { VIEWPOINT_PATH }
