import { asset } from '../../lib/asset'
import LocationFilter from './LocationFilter'
import ViewpointCard from './ViewpointCard'

const nearbyGems = [
  {
    image: asset('assets/home/nearby-1.png'),
    title: 'laguna ridge sunset point',
    rating: '4.3',
  },
  {
    image: asset('assets/home/nearby-2.png'),
    title: 'sunset ridge lookout',
    rating: '4.6',
  },
  {
    image: asset('assets/home/nearby-3.png'),
    title: 'coastal cliff point',
    rating: '4.5',
  },
]

export default function NearbyGemsSection() {
  return (
    <section className="motion-fade-in w-full pb-10">
      <div className="w-full rounded border border-black p-4 sm:p-5 lg:p-7">
        <h2 className="mb-5 text-[24px] font-bold text-black lg:mb-7">
          Nearby Gems
        </h2>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
          <LocationFilter />

          <div className="flex min-w-0 gap-4 overflow-x-auto pb-2 sm:gap-5">
            {nearbyGems.map((gem) => (
              <ViewpointCard key={gem.title} {...gem} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
