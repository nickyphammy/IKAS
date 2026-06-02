import { asset } from '../../lib/asset'
import SavedSearchBar from './SavedSearchBar'
import SavedViewpointCard from './SavedViewpointCard'

const savedViewpoints = [
  {
    image: asset('assets/saved/crescent-bay.png'),
    title: 'Crescent Bay Lookout',
    description: 'Stunning turqoise waters and palm-lined coastline',
    tags: 'Sunset, Ocean view',
    distance: '9.1 mi away',
  },
  {
    image: asset('assets/saved/heisler-park.png'),
    title: 'Heisler Park Overlook',
    description: 'Clifftop views, tidepools, and coastal bluffs',
    tags: 'photography, Ocean views',
    distance: '10.2 mi away',
  },
  {
    image: asset('assets/saved/newport-beach.png'),
    title: 'Newport Beach',
    description: 'Panoramic sunset views',
    tags: 'Sunset, Ocean view, Hiking',
    distance: '3.4 mi away',
  },
]

export default function SavedViewpointsSection() {
  return (
    <section className="motion-fade-in w-full pb-10">
      <h1 className="mb-5 text-[24px] font-bold text-black sm:text-[32px] lg:mb-6">
        Saved viewpoints
      </h1>

      <div className="mb-6 lg:mb-8">
        <SavedSearchBar />
      </div>

      <div className="flex flex-wrap items-stretch gap-5 lg:gap-8 xl:gap-10">
        {savedViewpoints.map((viewpoint) => (
          <SavedViewpointCard key={viewpoint.title} {...viewpoint} />
        ))}
      </div>
    </section>
  )
}
