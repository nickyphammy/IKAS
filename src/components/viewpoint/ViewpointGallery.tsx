import ViewpointInfoSidebar from './ViewpointInfoSidebar'

type ViewpointGalleryProps = {
  image: string
  alt: string
  bestTime: string
  tags: string[]
  distance: string
  difficulty: string
  estimatedVisit: string
}

export default function ViewpointGallery({
  image,
  alt,
  bestTime,
  tags,
  distance,
  difficulty,
  estimatedVisit,
}: ViewpointGalleryProps) {
  return (
    <section className="flex min-w-0 flex-col gap-4 lg:flex-row lg:gap-5">
      <div className="motion-pop group h-[240px] w-full min-w-0 overflow-hidden rounded-lg sm:h-[344px] lg:h-[456px] lg:flex-1">
        <img src={image} alt={alt} className="motion-image size-full object-cover" />
      </div>
      <ViewpointInfoSidebar
        bestTime={bestTime}
        tags={tags}
        distance={distance}
        difficulty={difficulty}
        estimatedVisit={estimatedVisit}
      />
    </section>
  )
}
