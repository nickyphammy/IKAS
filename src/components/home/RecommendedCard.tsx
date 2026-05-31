import { Link } from 'react-router-dom'

const VIEWPOINT_PATH = '/viewpoint'

type RecommendedCardProps = {
  image: string
  alt: string
}

export default function RecommendedCard({ image, alt }: RecommendedCardProps) {
  return (
    <Link
      to={VIEWPOINT_PATH}
      className="block h-[244px] w-full shrink-0 overflow-hidden rounded-[40px] sm:w-[289px]"
    >
      <img src={image} alt={alt} className="size-full object-cover" />
    </Link>
  )
}

export { VIEWPOINT_PATH }
