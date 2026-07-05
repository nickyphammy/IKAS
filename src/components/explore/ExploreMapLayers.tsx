import { Circle, Marker, Popup, useMapEvents } from 'react-leaflet'
import { useExploreRadius } from '@/components/explore/exploreRadiusContext'
import { milesToMeters } from '@/lib/geo'
import { viewpointMarkerIcon } from '@/lib/map'
import type { Viewpoint } from '@/types'

function MapClickHandler() {
  const { radiusMode, setCenter } = useExploreRadius()

  useMapEvents({
    click(e) {
      if (radiusMode) {
        setCenter({ lat: e.latlng.lat, lng: e.latlng.lng })
      }
    },
  })

  return null
}

interface ExploreMapLayersProps {
  viewpoints: Viewpoint[]
}

export function ExploreMapLayers({ viewpoints }: ExploreMapLayersProps) {
  const { radiusMode, radiusMiles, center } = useExploreRadius()

  return (
    <>
      <MapClickHandler />
      {viewpoints.map((vp) => (
        <Marker key={vp.id} position={[vp.latitude, vp.longitude]} icon={viewpointMarkerIcon}>
          <Popup>
            <div className="min-w-[160px]">
              <p className="font-semibold">{vp.name}</p>
              {vp.avg_rating != null && (
                <p className="text-xs text-muted">★ {vp.avg_rating.toFixed(1)}</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
      {radiusMode && center && (
        <Circle
          center={[center.lat, center.lng]}
          radius={milesToMeters(radiusMiles)}
          pathOptions={{ color: '#ff8c42', fillColor: '#ff8c42', fillOpacity: 0.12 }}
        />
      )}
    </>
  )
}
