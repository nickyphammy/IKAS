import { useMemo, useRef, useState } from 'react'
import { LocateFixed } from 'lucide-react'
import { MapContainer } from 'react-leaflet'
import { ExploreControls } from '@/components/explore/ExploreControls'
import { ExploreMapLayers } from '@/components/explore/ExploreMapLayers'
import { ExploreRadiusProvider, useExploreRadius } from '@/components/explore/exploreRadiusContext'
import { MapFlyToHandler } from '@/components/map/MapFlyToHandler'
import { MapTileLayer } from '@/components/map/MapTileLayer'
import { UserLocationLayer } from '@/components/map/UserLocationLayer'
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, MAP_MAX_ZOOM } from '@/lib/constants'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useGeolocation, useViewpoints } from '@/hooks/use-viewpoints'
import { Button } from '@/components/ui/button'

function ExploreMapContent() {
  const [search, setSearch] = useState('')
  // Query once typing pauses rather than on every keystroke.
  const debouncedSearch = useDebouncedValue(search.trim(), 350)
  const { center, radiusMiles, radiusMode } = useExploreRadius()
  const { data: userLocation, refetch: refetchLocation } = useGeolocation()
  const flyToRef = useRef<(lat: number, lng: number) => void>(() => {})

  const filters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      centerLat: radiusMode && center ? center.lat : undefined,
      centerLng: radiusMode && center ? center.lng : undefined,
      radiusMiles: radiusMode && center ? radiusMiles : undefined,
    }),
    [debouncedSearch, center, radiusMiles, radiusMode],
  )

  const { data: viewpoints = [], isFetching, isPlaceholderData, isError } = useViewpoints(filters)
  // Only claim "no matches" for a settled, successful result of what is in the box right now.
  const noMatches =
    Boolean(debouncedSearch) &&
    debouncedSearch === search.trim() &&
    !isFetching &&
    !isPlaceholderData &&
    !isError &&
    viewpoints.length === 0

  async function handleLocate() {
    if (userLocation) {
      flyToRef.current(userLocation.lat, userLocation.lng)
      return
    }
    const result = await refetchLocation()
    if (result.data) {
      flyToRef.current(result.data.lat, result.data.lng)
    }
  }

  return (
    <div className="relative h-[calc(100dvh-8rem)] md:h-[calc(100dvh-4rem)]">
      <ExploreControls
        search={search}
        onSearchChange={setSearch}
        noMatches={noMatches ? debouncedSearch : null}
      />
      <MapContainer
        center={[DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng]}
        zoom={DEFAULT_MAP_ZOOM}
        maxZoom={MAP_MAX_ZOOM}
        // Below md the full-width search bar covers the zoom buttons; pinch-zoom covers it there.
        className="h-full w-full max-md:[&_.leaflet-control-zoom]:hidden"
        scrollWheelZoom
      >
        <MapTileLayer />
        <UserLocationLayer flyToOnLoad zoom={13} />
        <MapFlyToHandler flyToRef={flyToRef} />
        <ExploreMapLayers viewpoints={viewpoints} />
      </MapContainer>
      <div className="absolute bottom-24 right-4 z-[1000] md:bottom-6">
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="h-12 w-12 rounded-full bg-white shadow-lg"
          onClick={handleLocate}
          aria-label="Go to my location"
        >
          <LocateFixed className="h-5 w-5 text-brand" />
        </Button>
      </div>
    </div>
  )
}

export default function ExplorePage() {
  return (
    <ExploreRadiusProvider>
      <ExploreMapContent />
    </ExploreRadiusProvider>
  )
}
