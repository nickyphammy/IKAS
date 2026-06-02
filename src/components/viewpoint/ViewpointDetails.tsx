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
    <section className="relative px-1 pb-10 pt-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <ViewpointStarRating rating={rating} />
        <Button
          variant="cta"
          className="h-12 shrink-0 rounded-xl px-6 text-[16px] sm:self-start"
        >
          report post
        </Button>
      </div>

      <h1 className="mb-3 max-w-[750px] text-[24px] font-bold text-black sm:text-[32px]">
        {name}
      </h1>

      <div className="mb-6 text-black">
        <p className="text-[16px]">@ {address}</p>
        <p className="text-[16px]">
          lat : {latitude} lng: {longitude}
        </p>
      </div>

      <p className="max-w-[1008px] text-[16px] leading-normal text-black">
        {description}
      </p>
    </section>
  )
}
