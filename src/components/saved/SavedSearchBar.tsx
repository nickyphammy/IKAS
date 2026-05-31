import { asset } from '../../lib/asset'

export default function SavedSearchBar() {
  return (
    <div className="relative w-full max-w-[469px]">
      <label htmlFor="saved-search" className="sr-only">
        Search saved viewpoints
      </label>
      <img
        src={asset('assets/explore/search-icon.png')}
        alt=""
        className="pointer-events-none absolute left-5 top-1/2 size-8 -translate-y-1/2"
        aria-hidden
      />
      <input
        id="saved-search"
        type="search"
        placeholder="search"
        className="h-[59px] w-full rounded-[32px] border border-black bg-white/65 pl-14 pr-6 text-2xl text-black placeholder:text-black focus:outline-none focus:ring-2 focus:ring-[#ff9e43]"
      />
    </div>
  )
}
