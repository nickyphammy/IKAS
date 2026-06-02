import LocationCard, { landingGallerySpots } from './LocationCard'

export default function HeroGallery() {
  const [largeSpot, smallSpot] = landingGallerySpots

  return (
    <div className="relative flex w-full min-w-0 max-w-[520px] flex-col items-end gap-6 lg:items-start">
      <div className="flex min-w-0 items-end gap-4 overflow-x-auto pb-2 sm:gap-8">
        <LocationCard size="large" {...largeSpot} />
        <div className="mt-12 shrink-0 sm:mt-24">
          <LocationCard size="small" {...smallSpot} />
        </div>
      </div>
    </div>
  )
}
