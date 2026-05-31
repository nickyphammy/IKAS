import { asset } from '../../lib/asset'

export default function LocationFilter() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xl text-black">location</p>
      <div className="flex h-[50px] w-full max-w-[281px] items-center gap-3 rounded-2xl border border-black px-4">
        <img
          src={asset('assets/home/location-icon.png')}
          alt=""
          className="size-6 shrink-0"
          aria-hidden
        />
        <span className="text-base text-black">orange country</span>
      </div>
    </div>
  )
}
