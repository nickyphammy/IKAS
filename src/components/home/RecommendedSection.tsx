import { asset } from '../../lib/asset'
import RecommendedCard from './RecommendedCard'

const recommendations = [
  {
    image: asset('assets/home/recommended-1.png'),
    alt: 'Tropical beach with turquoise water',
    name: 'Crystal Cove Shore',
    rating: '4.8',
    description: 'Turquoise shallows and soft sand, perfect for a morning swim.',
  },
  {
    image: asset('assets/home/recommended-2.png'),
    alt: 'Rocky coastline at sunset',
    name: 'Heisler Park Cove',
    rating: '4.6',
    description: 'Golden-hour cliffs and tide pools along the coastal trail.',
  },
  {
    image: asset('assets/home/recommended-3.png'),
    alt: 'Sandy beach from elevated view',
    name: 'Newport Pier Lookout',
    rating: '4.4',
    description: 'Elevated view of the shoreline with easy pier access nearby.',
  },
]

export default function RecommendedSection() {
  return (
    <section className="w-full py-8">
      <h2 className="mb-6 text-[28px] font-bold text-black sm:text-[32px]">
        Recommended for you
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2 lg:gap-6">
        {recommendations.map((item) => (
          <RecommendedCard key={item.name} {...item} />
        ))}
      </div>
    </section>
  )
}
