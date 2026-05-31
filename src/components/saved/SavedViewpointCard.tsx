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
    <article className="flex w-full max-w-[312px] shrink-0 flex-col overflow-hidden rounded-[40px] bg-white">
      <Link to={VIEWPOINT_PATH} className="block h-[263px] w-full overflow-hidden">
        <img src={image} alt={title} className="size-full object-cover" />
      </Link>

      <div className="flex flex-1 flex-col gap-3 px-4 pb-5 pt-4">
        <Link
          to={VIEWPOINT_PATH}
          className="text-2xl font-semibold text-black hover:opacity-80"
        >
          {title}
        </Link>
        <p className="text-xl text-black">{description}</p>
        <p className="text-xl text-black">Tags: {tags}</p>

        <div className="mt-auto flex items-end justify-between pt-2">
          <p className="text-xl text-black">{distance}</p>
          <ArrowButton
            label={`View ${title}`}
            to={VIEWPOINT_PATH}
            className="size-[54px]"
          />
        </div>
      </div>
    </article>
  )
}
