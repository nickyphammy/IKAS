import { asset } from '../../lib/asset'

type LocationCardProps = {
  size?: 'large' | 'small'
  name: string
  image: string
  alt: string
}

export default function LocationCard({
  size = 'large',
  name,
  image,
  alt,
}: LocationCardProps) {
  const isLarge = size === 'large'

  return (
    <figure
      className={`flex shrink-0 flex-col ${isLarge ? 'w-[200px] sm:w-[240px] lg:w-[287px]' : 'w-[140px] sm:w-[160px] lg:w-[193px]'}`}
    >
      <figcaption
        className={`mb-2 leading-tight text-black ${isLarge ? 'text-xl sm:text-2xl lg:text-3xl' : 'text-base sm:text-lg lg:text-xl'}`}
      >
        {name}
      </figcaption>
      <div
        className={`overflow-hidden rounded-lg ${isLarge ? 'h-[268px] sm:h-[320px] lg:h-[384px]' : 'h-[186px] sm:h-[220px] lg:h-[257px]'}`}
      >
        <img src={image} alt={alt} className="size-full object-cover" />
      </div>
    </figure>
  )
}

export const landingGallerySpots = [
  {
    name: 'laguna ridge sunset point',
    image: asset('assets/home/nearby-1.png'),
    alt: 'City skyline at sunset from a ridge overlook',
  },
  {
    name: 'sunset ridge lookout',
    image: asset('assets/home/nearby-2.png'),
    alt: 'Sunset over green landscape from a ridge',
  },
] as const
