import { Circle, Marker, Popup, useMapEvents } from 'react-leaflet'
import { useExploreRadius } from '@/components/explore/exploreRadiusContext'
import { milesToMeters } from '@/lib/geo'
import type { Viewpoint } from '@/types'
import L from 'leaflet'

const markerIcon = L.divIcon({
  className: '',
  html: '<div style="width:14px;height:14px;background:#ff8c42;border:2px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

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
        <Marker key={vp.id} position={[vp.latitude, vp.longitude]} icon={markerIcon}>
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
