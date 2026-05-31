import { asset } from '../../lib/asset'

type LocationCardProps = {
  size?: 'large' | 'small'
}

export default function LocationCard({ size = 'large' }: LocationCardProps) {
  const isLarge = size === 'large'

  return (
    <figure
      className={`mx-auto flex w-full max-w-[287px] flex-col ${isLarge ? 'sm:max-w-[287px]' : 'sm:max-w-[193px]'}`}
    >
      <figcaption
        className={`mb-2 text-black ${isLarge ? 'text-4xl' : 'text-2xl'}`}
      >
        location
      </figcaption>
      <div className={`overflow-hidden ${isLarge ? 'h-[384px]' : 'h-[257px]'}`}>
        <img
          src={asset('assets/landing/location.png')}
          alt="Scenic viewpoint at sunset"
          className="size-full object-cover"
        />
      </div>
    </figure>
  )
}
