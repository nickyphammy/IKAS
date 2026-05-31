import { asset } from '../../lib/asset'
import RecommendedCard from './RecommendedCard'

const recommendations = [
  {
    image: asset('assets/home/recommended-1.png'),
    alt: 'Tropical beach with turquoise water',
  },
  {
    image: asset('assets/home/recommended-2.png'),
    alt: 'Rocky coastline at sunset',
  },
  {
    image: asset('assets/home/recommended-3.png'),
    alt: 'Sandy beach from elevated view',
  },
]

export default function RecommendedSection() {
  return (
    <section className="w-full py-8">
      <h2 className="mb-6 text-center text-[28px] font-bold text-black sm:text-[32px]">
        Recommended for you
      </h2>
      <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
        {recommendations.map((item) => (
          <RecommendedCard key={item.alt} {...item} />
        ))}
      </div>
    </section>
  )
}
