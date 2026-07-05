import { TileLayer } from 'react-leaflet'
import { MAP_TILE_ATTRIBUTION, MAP_TILE_URL } from '@/lib/map'

export function MapTileLayer() {
  return (
    <TileLayer
      attribution={MAP_TILE_ATTRIBUTION}
      url={MAP_TILE_URL}
      subdomains="abcd"
      maxZoom={20}
    />
  )
}
