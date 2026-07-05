import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

interface MapFlyToHandlerProps {
  flyToRef: React.MutableRefObject<(lat: number, lng: number) => void>
  zoom?: number
}

export function MapFlyToHandler({ flyToRef, zoom = 14 }: MapFlyToHandlerProps) {
  const map = useMap()

  useEffect(() => {
    flyToRef.current = (lat: number, lng: number) => {
      map.flyTo([lat, lng], zoom, { duration: 0.8 })
    }
  }, [map, flyToRef, zoom])

  return null
}
