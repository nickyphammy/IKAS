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
    <section className="w-full pb-16">
      <div className="w-full rounded border border-black p-4 sm:p-6 lg:p-10">
        <h2 className="mb-8 text-[28px] font-bold text-black sm:text-[32px] lg:mb-12">
          Nearby Gems
        </h2>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
          <LocationFilter />

          <div className="flex min-w-0 gap-4 overflow-x-auto pb-2 sm:gap-6">
            {nearbyGems.map((gem) => (
              <ViewpointCard key={gem.title} {...gem} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
