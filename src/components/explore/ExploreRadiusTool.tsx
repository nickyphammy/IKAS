import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const RADIUS_OPTIONS = [
  {
    miles: 5,
    diameterPx: 72,
    ringClass: 'border-[#ff9e43] bg-[#ff9e43]/25',
    labelClass: 'bg-[#ff9e43]',
  },
  {
    miles: 10,
    diameterPx: 120,
    ringClass: 'border-[#ff9a76] bg-[#ff9a76]/20',
    labelClass: 'bg-[#ff9a76]',
  },
  {
    miles: 50,
    diameterPx: 200,
    ringClass: 'border-[#0004ff] bg-[#0004ff]/15 border-dashed',
    labelClass: 'bg-[#0004ff]',
  },
  {
    miles: 100,
    diameterPx: 300,
    ringClass: 'border-black/70 bg-white/25 border-[3px]',
    labelClass: 'bg-black',
  },
] as const

type Miles = (typeof RADIUS_OPTIONS)[number]['miles']

type Point = { x: number; y: number }

export default function ExploreRadiusTool() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = useState(false)
  const [selectedMiles, setSelectedMiles] = useState<Miles>(10)
  const [cursor, setCursor] = useState<Point | null>(null)
  const [placedCenter, setPlacedCenter] = useState<Point | null>(null)
  const [showPlaceHint, setShowPlaceHint] = useState(false)

  const option =
    RADIUS_OPTIONS.find((o) => o.miles === selectedMiles) ?? RADIUS_OPTIONS[1]

  const circleCenter = placedCenter ?? cursor

  const updateCursorFromEvent = useCallback(
    (clientX: number, clientY: number) => {
      const el = mapRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      setCursor({
        x: clientX - rect.left,
        y: clientY - rect.top,
      })
    },
    [],
  )

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isActive) return
    updateCursorFromEvent(event.clientX, event.clientY)
  }

  function handlePointerLeave() {
    if (!placedCenter) setCursor(null)
  }

  function handleMapClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!isActive) return
    const el = mapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const point = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
    setPlacedCenter(point)
    setCursor(point)
    setShowPlaceHint(true)
  }

  function handleToggle() {
    setIsActive((prev) => {
      if (prev) {
        setCursor(null)
        setPlacedCenter(null)
        setShowPlaceHint(false)
      }
      return !prev
    })
  }

  function handleClearPlacement() {
    setPlacedCenter(null)
    setShowPlaceHint(false)
  }

  return (
    <>
      <div
        ref={mapRef}
        className={`absolute inset-0 ${isActive ? 'cursor-crosshair' : 'pointer-events-none'}`}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleMapClick}
        aria-hidden={!isActive}
      >
        {isActive && circleCenter && (
          <>
            <div
              className="motion-fade-in pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: circleCenter.x,
                top: circleCenter.y,
                width: option.diameterPx,
                height: option.diameterPx,
              }}
            >
              <div
                className={`size-full rounded-full border-2 shadow-lg backdrop-blur-[1px] ${option.ringClass}`}
              />
              <div
                className={`absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ${option.labelClass}`}
              />
            </div>

            {showPlaceHint && placedCenter && (
              <div
                className="pointer-events-none absolute -translate-x-1/2"
                style={{
                  left: placedCenter.x,
                  top: placedCenter.y + option.diameterPx / 2 + 12,
                }}
              >
                <div className="motion-fade-in whitespace-nowrap rounded-xl border border-black bg-white/90 px-3 py-2 text-center text-[16px] text-black shadow-md">
                  <p className="font-semibold">Viewpoints in this area</p>
                  <p className="text-[16px] text-[#666]">
                    (preview — search not wired yet)
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="pointer-events-auto absolute bottom-5 left-4 z-40 flex max-w-[min(100%,20rem)] flex-col gap-2 sm:left-6 lg:bottom-8">
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
            <p className="mb-2 text-[16px] font-bold text-black">
              Radius
            </p>
            <div className="flex flex-wrap gap-2">
              {RADIUS_OPTIONS.map(({ miles, diameterPx, ringClass }) => (
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
                    className={`shrink-0 rounded-full border ${ringClass}`}
                    style={{
                      width: Math.max(14, diameterPx * 0.12),
                      height: Math.max(14, diameterPx * 0.12),
                    }}
                    aria-hidden
                  />
                  {miles} mi
                </button>
              ))}
            </div>
            <p className="mt-2 text-[16px] leading-snug text-[#666]">
              Move over the map, then click to place your search area. Circle
              size is visual only (not true map scale).
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
    </>
  )
}
