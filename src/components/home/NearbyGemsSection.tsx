import { asset } from '../../lib/asset'
import LocationFilter from './LocationFilter'
import FeaturedViewpointCard, {
  SecondaryViewpointCard,
} from './ViewpointCard'

export default function NearbyGemsSection() {
  return (
    <section className="w-full pb-16">
      <div className="mx-auto w-full max-w-[1335px] rounded border border-black p-6 lg:p-10">
        <h2 className="mb-8 text-center text-[28px] font-bold text-black sm:text-[32px] lg:mb-12">
          Nearby Gems
        </h2>

        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-center lg:gap-16">
          <LocationFilter />

          <div className="flex flex-wrap items-end justify-center gap-6">
            <FeaturedViewpointCard
              image={asset('assets/home/nearby-1.png')}
              title="somewhere viewpoint"
              rating="4.3"
            />
            <SecondaryViewpointCard
              image={asset('assets/home/nearby-2.png')}
              alt="Sunset over green landscape"
            />
            <SecondaryViewpointCard
              image={asset('assets/home/nearby-3.png')}
              alt="Rocky cliff overlooking the ocean"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
