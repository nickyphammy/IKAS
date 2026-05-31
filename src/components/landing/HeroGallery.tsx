import LocationCard from './LocationCard'
import ProgressIndicator from './ProgressIndicator'

export default function HeroGallery() {
  return (
    <div className="relative flex flex-col items-end gap-6 lg:items-start">
      <div className="flex items-end gap-8">
        <LocationCard size="large" />
        <div className="mt-24">
          <LocationCard size="small" />
        </div>
      </div>

      <div className="flex w-full items-center justify-between">
        <div className="flex gap-3">
          <img
            src="/assets/landing/dot.png"
            alt=""
            className="size-[74px]"
            aria-hidden
          />
          <img
            src="/assets/landing/dot.png"
            alt=""
            className="size-[74px]"
            aria-hidden
          />
        </div>
        <ProgressIndicator activeIndex={0} />
      </div>
    </div>
  )
}
