import { asset } from '../../lib/asset'

export default function LocationFilter() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[16px] text-black">location</p>
      <div className="motion-focus flex h-10 w-full max-w-[256px] items-center gap-2 rounded-xl border border-black px-3 focus-within:-translate-y-0.5 focus-within:ring-2 focus-within:ring-[#ff9e43]">
        <img
          src={asset('assets/home/location-icon.png')}
          alt=""
          className="size-5 shrink-0"
          aria-hidden
        />
        <input
          type="text"
          placeholder="search location"
          className="min-w-0 flex-1 bg-transparent text-[16px] font-normal text-black placeholder:text-black focus:outline-none"
          aria-label="Search location"
        />
      </div>
    </div>
  )
}
