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
    <section className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-4 lg:flex-row lg:items-start lg:justify-center lg:gap-6">
      <div className="h-[320px] w-full max-w-[900px] overflow-hidden rounded-lg sm:h-[440px] lg:h-[556px] lg:flex-1">
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
