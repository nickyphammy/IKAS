import { useEffect } from 'react'
import type { Layer } from 'leaflet'
import { useMap } from 'react-leaflet'
import { MAP_TILE_ATTRIBUTION } from '@/lib/map'

export function MapTileLayer() {
  const map = useMap()

  useEffect(() => {
    let layer: Layer | null = null
    let cancelled = false

    map.attributionControl?.addAttribution(MAP_TILE_ATTRIBUTION)
    // MapLibre is large, so it is only fetched once a map is on screen.
    void import('@/lib/maplibre-base-layer').then(({ createBaseLayer }) => {
      if (cancelled) return
      layer = createBaseLayer().addTo(map)
    })

    return () => {
      cancelled = true
      layer?.remove()
      map.attributionControl?.removeAttribution(MAP_TILE_ATTRIBUTION)
    }
  }, [map])

  return null
}
