import { asset } from '../../lib/asset'

type LocationCardProps = {
  size?: 'large' | 'small'
}

export default function LocationCard({ size = 'large' }: LocationCardProps) {
  const isLarge = size === 'large'

  return (
    <figure
      className={`flex shrink-0 flex-col ${isLarge ? 'w-[200px] sm:w-[240px] lg:w-[287px]' : 'w-[140px] sm:w-[160px] lg:w-[193px]'}`}
    >
      <figcaption
        className={`mb-2 text-black ${isLarge ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-xl sm:text-2xl'}`}
      >
        location
      </figcaption>
      <div
        className={`overflow-hidden ${isLarge ? 'h-[268px] sm:h-[320px] lg:h-[384px]' : 'h-[186px] sm:h-[220px] lg:h-[257px]'}`}
      >
        <img
          src={asset('assets/landing/location.png')}
          alt="Scenic viewpoint at sunset"
          className="size-full object-cover"
        />
      </div>
    </figure>
  )
}
