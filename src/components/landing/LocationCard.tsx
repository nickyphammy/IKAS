import { asset } from '../../lib/asset'

type LocationCardProps = {
  variant?: 'hero' | 'side' | 'mini'
  name: string
  image: string
  alt: string
  note: string
  className?: string
}

export default function LocationCard({
  variant = 'hero',
  name,
  image,
  alt,
  note,
  className = '',
}: LocationCardProps) {
  const sizeClasses = {
    hero: 'h-[272px] w-[216px] sm:h-[336px] sm:w-[264px] lg:h-[392px] lg:w-[304px]',
    side: 'h-[216px] w-[176px] sm:h-[264px] sm:w-[216px] lg:h-[304px] lg:w-[240px]',
    mini: 'h-[152px] w-[152px] sm:h-[184px] sm:w-[184px] lg:h-[216px] lg:w-[216px]',
  }

  return (
    <figure
      className={`motion-pop group absolute overflow-hidden rounded-[24px] bg-white p-2 shadow-[0_20px_48px_rgba(0,0,0,0.22)] ${sizeClasses[variant]} ${className}`}
    >
      <div className="size-full overflow-hidden rounded-[18px]">
        <img src={image} alt={alt} className="motion-image size-full object-cover" />
      </div>
      <figcaption className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/85 px-3 py-2 shadow-sm backdrop-blur-sm">
        <p className="text-[16px] font-bold leading-tight text-black">{name}</p>
        <p className="text-[16px] leading-tight text-black/65">{note}</p>
      </figcaption>
    </figure>
  )
}

export const landingGallerySpots = [
  {
    name: 'laguna ridge sunset point',
    image: asset('assets/home/nearby-1.png'),
    alt: 'City skyline at sunset from a ridge overlook',
    note: 'sunset ridge',
  },
  {
    name: 'sunset ridge lookout',
    image: asset('assets/home/nearby-2.png'),
    alt: 'Sunset over green landscape from a ridge',
    note: 'golden-hour pick',
  },
  {
    name: 'crystal cove shore',
    image: asset('assets/home/recommended-1.png'),
    alt: 'Turquoise water and beach at Crystal Cove',
    note: 'daily favorite',
  },
] as const
