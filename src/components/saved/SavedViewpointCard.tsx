import { Link } from 'react-router-dom'
import ArrowButton from '../ui/ArrowButton'

const VIEWPOINT_PATH = '/viewpoint'

export type SavedViewpoint = {
  image: string
  title: string
  description: string
  tags: string
  distance: string
}

export default function SavedViewpointCard({
  image,
  title,
  description,
  tags,
  distance,
}: SavedViewpoint) {
  return (
    <article className="motion-pop group flex w-full max-w-[272px] shrink-0 flex-col overflow-hidden rounded-[24px] bg-white">
      <Link to={VIEWPOINT_PATH} className="block h-[200px] w-full overflow-hidden">
        <img src={image} alt={title} className="motion-image size-full object-cover" />
      </Link>

      <div className="flex flex-1 flex-col gap-2 px-4 pb-4 pt-3">
        <Link
          to={VIEWPOINT_PATH}
          className="text-[16px] font-semibold text-black transition duration-200 hover:opacity-80 group-hover:text-[#ff7f10]"
        >
          {title}
        </Link>
        <p className="text-[16px] text-black">{description}</p>
        <p className="text-[16px] text-black">Tags: {tags}</p>

        <div className="mt-auto flex items-end justify-between pt-2">
          <p className="text-[16px] text-black">{distance}</p>
          <ArrowButton
            label={`View ${title}`}
            to={VIEWPOINT_PATH}
            className="size-12"
          />
        </div>
      </div>
    </article>
  )
}
