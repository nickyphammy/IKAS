import { Link } from 'react-router-dom'
import { RADIUS_OPTIONS, useExploreRadius } from './exploreRadiusContext'

export default function ExploreRadiusControls() {
  const {
    isActive,
    selectedMiles,
    placedCenter,
    setSelectedMiles,
    handleToggle,
    handleClearPlacement,
  } = useExploreRadius()

  return (
    <div className="pointer-events-auto absolute bottom-5 left-4 z-[1000] flex max-w-[min(100%,20rem)] flex-col gap-2 sm:left-6 lg:bottom-8">
      <Link
        to="/daily-recs"
        className="motion-press rounded-[24px] border border-[#ff7f10] bg-[#ff9e43] px-4 py-2 text-center text-[16px] font-bold text-black shadow-[0_0_22px_rgba(255,126,16,0.65)] hover:bg-[#ff8f2a] hover:shadow-[0_0_30px_rgba(255,126,16,0.85)]"
      >
        view recs
      </Link>

      <button
        type="button"
        onClick={handleToggle}
        className={`motion-press rounded-[24px] border border-black px-4 py-2 text-[16px] font-bold shadow-lg ${
          isActive
            ? 'bg-[#ff9e43] text-black'
            : 'bg-white/90 text-black hover:bg-white'
        }`}
      >
        {isActive ? 'exit radius search' : 'search by radius'}
      </button>

      {isActive && (
        <div className="motion-fade-in rounded-xl border border-black bg-white/90 p-3 shadow-lg">
          <p className="mb-2 text-[16px] font-bold text-black">Radius</p>
          <div className="flex flex-wrap gap-2">
            {RADIUS_OPTIONS.map(({ miles, ringClass }) => (
              <button
                key={miles}
                type="button"
                onClick={() => setSelectedMiles(miles)}
                className={`motion-press flex items-center gap-2 rounded-full border px-3 py-1.5 text-[16px] ${
                  selectedMiles === miles
                    ? 'border-black bg-[#fff7ef] font-bold'
                    : 'border-[#ccc] bg-white hover:border-black'
                }`}
              >
                <span
                  className={`size-3.5 shrink-0 rounded-full border ${ringClass}`}
                  aria-hidden
                />
                {miles} mi
              </button>
            ))}
          </div>
          <p className="mt-2 text-[16px] leading-snug text-[#666]">
            Move over the map, then click to place your search area. Circle
            size matches the radius you select.
          </p>
          {placedCenter && (
            <button
              type="button"
              onClick={handleClearPlacement}
              className="motion-press mt-2 rounded px-1 text-[16px] text-[#0004ff] hover:underline"
            >
              clear placement
            </button>
          )}
        </div>
      )}
    </div>
  )
}
