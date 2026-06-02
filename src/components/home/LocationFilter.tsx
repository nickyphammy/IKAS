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
        <input
          type="text"
          placeholder="search location"
          className="min-w-0 flex-1 bg-transparent text-base font-normal text-black placeholder:text-black focus:outline-none"
          aria-label="Search location"
        />
      </div>
    </div>
  )
}
