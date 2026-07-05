import { useEffect } from 'react'
import { Marker, useMap } from 'react-leaflet'
import { useGeolocation } from '@/hooks/use-viewpoints'
import { userLocationIcon } from '@/lib/map'

interface UserLocationLayerProps {
  flyToOnLoad?: boolean
  zoom?: number
}

function FlyToUser({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap()

  useEffect(() => {
    map.flyTo([lat, lng], zoom, { duration: 1 })
  }, [map, lat, lng, zoom])

  return null
}

export function UserLocationLayer({ flyToOnLoad = false, zoom = 13 }: UserLocationLayerProps) {
  const { data: location } = useGeolocation()

  if (!location) return null

  return (
    <>
      <Marker position={[location.lat, location.lng]} icon={userLocationIcon} zIndexOffset={1000} />
      {flyToOnLoad && <FlyToUser lat={location.lat} lng={location.lng} zoom={zoom} />}
    </>
  )
}
