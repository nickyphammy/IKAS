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
    <section className="w-full pb-16">
      <h1 className="mb-8 text-center text-[36px] font-bold text-black sm:text-[52px] lg:mb-10">
        Saved viewpoints
      </h1>

      <div className="mb-10 flex justify-center lg:mb-12">
        <SavedSearchBar />
      </div>

      <div className="flex flex-wrap justify-center gap-8 lg:gap-12 xl:gap-16">
        {savedViewpoints.map((viewpoint) => (
          <SavedViewpointCard key={viewpoint.title} {...viewpoint} />
        ))}
      </div>
    </section>
  )
}
