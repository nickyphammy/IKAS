import { MapContainer, TileLayer } from 'react-leaflet'
import {
  ORANGE_COUNTY_CENTER,
  ORANGE_COUNTY_ZOOM,
} from '../../lib/orangeCounty'
import { ExploreRadiusProvider, useExploreRadius } from './exploreRadiusContext'
import ExploreRadiusControls from './ExploreRadiusControls'
import ExploreRadiusMapLayer from './ExploreRadiusMapLayer'

function ExploreMapContainer() {
  const { isActive } = useExploreRadius()

  return (
    <MapContainer
      center={[ORANGE_COUNTY_CENTER.lat, ORANGE_COUNTY_CENTER.lng]}
      zoom={ORANGE_COUNTY_ZOOM}
      className={`size-full [&_.leaflet-container]:size-full ${
        isActive
          ? '[&_.leaflet-container]:cursor-crosshair'
          : '[&_.leaflet-container]:cursor-grab'
      }`}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ExploreRadiusMapLayer />
    </MapContainer>
  )
}

export default function ExploreMap() {
  return (
    <ExploreRadiusProvider>
      <div className="absolute inset-0 z-0">
        <ExploreMapContainer />
        <ExploreRadiusControls />
      </div>
    </ExploreRadiusProvider>
  )
}
