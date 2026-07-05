import { useMemo, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { ExploreControls } from '@/components/explore/ExploreControls'
import { ExploreMapLayers } from '@/components/explore/ExploreMapLayers'
import { ExploreRadiusProvider, useExploreRadius } from '@/components/explore/exploreRadiusContext'
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '@/lib/constants'
import { useViewpoints } from '@/hooks/use-viewpoints'

function ExploreMapContent() {
  const [search, setSearch] = useState('')
  const { center, radiusMiles, radiusMode } = useExploreRadius()

  const filters = useMemo(
    () => ({
      search: search || undefined,
      centerLat: radiusMode && center ? center.lat : undefined,
      centerLng: radiusMode && center ? center.lng : undefined,
      radiusMiles: radiusMode && center ? radiusMiles : undefined,
    }),
    [search, center, radiusMiles, radiusMode],
  )

  const { data: viewpoints = [] } = useViewpoints(filters)

  return (
    <div className="relative h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)]">
      <ExploreControls search={search} onSearchChange={setSearch} />
      <MapContainer
        center={[DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng]}
        zoom={DEFAULT_MAP_ZOOM}
        className="h-full w-full"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ExploreMapLayers viewpoints={viewpoints} />
      </MapContainer>
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
