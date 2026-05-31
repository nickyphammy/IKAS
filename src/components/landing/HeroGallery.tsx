import LocationCard from './LocationCard'
import ProgressIndicator from './ProgressIndicator'
import { asset } from '../../lib/asset'

export default function HeroGallery() {
  return (
    <div className="relative flex w-full min-w-0 max-w-[520px] flex-col items-end gap-6 lg:items-start">
      <div className="flex min-w-0 items-end gap-4 overflow-x-auto pb-2 sm:gap-8">
        <LocationCard size="large" />
        <div className="mt-12 shrink-0 sm:mt-24">
          <LocationCard size="small" />
        </div>
      </div>

      <div className="flex w-full min-w-0 items-center justify-between gap-4">
        <div className="flex shrink-0 gap-2 sm:gap-3">
          <img
            src={asset('assets/landing/dot.png')}
            alt=""
            className="size-12 sm:size-[74px]"
            aria-hidden
          />
          <img
            src={asset('assets/landing/dot.png')}
            alt=""
            className="size-12 sm:size-[74px]"
            aria-hidden
          />
        </div>
        <ProgressIndicator activeIndex={0} />
      </div>
    </div>
  )
}
