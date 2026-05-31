import LocationCard from './LocationCard'
import ProgressIndicator from './ProgressIndicator'
import { asset } from '../../lib/asset'

export default function HeroGallery() {
  return (
    <div className="relative flex w-full max-w-[520px] flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:justify-center">
        <LocationCard size="large" />
        <div className="sm:mt-24">
          <LocationCard size="small" />
        </div>
      </div>

      <div className="flex w-full max-w-[420px] items-center justify-between">
        <div className="flex gap-3">
          <img
            src={asset('assets/landing/dot.png')}
            alt=""
            className="size-[74px]"
            aria-hidden
          />
          <img
            src={asset('assets/landing/dot.png')}
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
