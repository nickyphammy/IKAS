import { asset } from '../../lib/asset'

export default function ExploreSearchBar() {
  return (
    <div className="relative w-full min-w-0 max-w-[831px]">
      <label htmlFor="explore-search" className="sr-only">
        Search viewpoints
      </label>
      <img
        src={asset('assets/explore/search-icon.png')}
        alt=""
        className="pointer-events-none absolute left-8 top-1/2 size-8 -translate-y-1/2"
        aria-hidden
      />
      <input
        id="explore-search"
        type="search"
        placeholder="search"
        className="h-[59px] w-full rounded-[32px] border border-black bg-white/65 pl-16 pr-6 text-xl text-black placeholder:text-black focus:outline-none focus:ring-2 focus:ring-[#ff9e43] sm:text-2xl"
      />
    </div>
  )
}
