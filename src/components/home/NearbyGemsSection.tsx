import { asset } from '../../lib/asset'
import LocationFilter from './LocationFilter'
import FeaturedViewpointCard, {
  SecondaryViewpointCard,
} from './ViewpointCard'

export default function NearbyGemsSection() {
  return (
    <section className="px-6 pb-16 lg:px-8">
      <div className="mx-auto max-w-[1335px] rounded border border-black p-6 lg:p-10">
        <h2 className="mb-8 text-[32px] font-bold text-black lg:mb-12">
          Nearby Gems
        </h2>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
          <LocationFilter />

          <div className="flex items-end gap-6 overflow-x-auto pb-2">
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
