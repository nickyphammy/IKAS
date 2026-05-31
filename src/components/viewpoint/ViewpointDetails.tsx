import Button from '../ui/Button'
import ViewpointStarRating from './ViewpointStarRating'

type ViewpointDetailsProps = {
  name: string
  rating: number
  address: string
  latitude: number
  longitude: number
  description: string
}

export default function ViewpointDetails({
  name,
  rating,
  address,
  latitude,
  longitude,
  description,
}: ViewpointDetailsProps) {
  return (
    <section className="relative px-1 pb-16 pt-8">
      <div className="mb-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <ViewpointStarRating rating={rating} />
        <Button
          variant="cta"
          className="h-16 shrink-0 rounded-2xl px-8 text-xl sm:self-start"
        >
          report post
        </Button>
      </div>

      <h1 className="mb-4 max-w-[750px] text-5xl font-bold text-black">{name}</h1>

      <div className="mb-6 text-black">
        <p className="text-2xl">@ {address}</p>
        <p className="text-xl">
          lat : {latitude} lng: {longitude}
        </p>
      </div>

      <p className="max-w-[1008px] text-base leading-normal text-black">
        {description}
      </p>
    </section>
  )
}
