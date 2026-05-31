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
    <section className="flex flex-col gap-4 lg:flex-row lg:gap-6">
      <div className="h-[556px] w-full overflow-hidden rounded-lg lg:flex-1">
        <img src={image} alt={alt} className="size-full object-cover" />
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
