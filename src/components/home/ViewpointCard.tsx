import { Link } from 'react-router-dom'
import ArrowButton from '../ui/ArrowButton'
import RatingBadge from './RatingBadge'

const VIEWPOINT_PATH = '/viewpoint'

type FeaturedViewpointCardProps = {
  image: string
  title: string
  rating: string
}

function splitTitle(title: string) {
  const [first, ...rest] = title.split(' ')
  return { first, second: rest.join(' ') }
}

export default function FeaturedViewpointCard({
  image,
  title,
  rating,
}: FeaturedViewpointCardProps) {
  const { first, second } = splitTitle(title)

  return (
    <article className="relative h-[385px] w-[332px] shrink-0 overflow-hidden rounded-[40px]">
      <Link to={VIEWPOINT_PATH} className="block size-full">
        <img src={image} alt={title} className="size-full object-cover" />
      </Link>
      <div className="pointer-events-none absolute left-7 top-7">
        <RatingBadge rating={rating} />
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/50 to-transparent px-7 pb-6 pt-16">
        <Link to={VIEWPOINT_PATH} className="text-2xl leading-tight text-white hover:opacity-90">
          <span className="block">{first}</span>
          {second ? <span className="block">{second}</span> : null}
        </Link>
        <ArrowButton label={`View ${title}`} to={VIEWPOINT_PATH} />
      </div>
    </article>
  )
}

type SecondaryViewpointCardProps = {
  image: string
  alt: string
}

export function SecondaryViewpointCard({
  image,
  alt,
}: SecondaryViewpointCardProps) {
  return (
    <Link
      to={VIEWPOINT_PATH}
      className="block h-[324px] w-[232px] shrink-0 overflow-hidden rounded-[40px] shadow-md"
    >
      <img src={image} alt={alt} className="size-full object-cover" />
    </Link>
  )
}

export { VIEWPOINT_PATH }
