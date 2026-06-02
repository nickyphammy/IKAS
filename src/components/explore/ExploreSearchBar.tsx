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
        className="pointer-events-none absolute left-6 top-1/2 size-6 -translate-y-1/2"
        aria-hidden
      />
      <input
        id="explore-search"
        type="search"
        placeholder="search"
        className="motion-focus h-12 w-full rounded-[24px] border border-black bg-white/65 pl-14 pr-5 text-[16px] text-black placeholder:text-black focus:outline-none focus:ring-2 focus:ring-[#ff9e43]"
      />
    </div>
  )
}
