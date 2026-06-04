import { Circle, Popup, useMap, useMapEvents } from 'react-leaflet'
import { useEffect } from 'react'
import { MILES_TO_METERS } from '../../lib/orangeCounty'
import { useExploreRadius } from './exploreRadiusContext'

function MapInvalidateSize() {
  const map = useMap()
  useEffect(() => {
    const id = requestAnimationFrame(() => map.invalidateSize())
    return () => cancelAnimationFrame(id)
  }, [map])
  return null
}

function RadiusMapEvents() {
  const { isActive, placedCenter, setCursorLatLng, placeCenter } =
    useExploreRadius()

  useMapEvents({
    mousemove(e) {
      if (!isActive) return
      setCursorLatLng(e.latlng)
    },
    mouseout() {
      if (!isActive || placedCenter) return
      setCursorLatLng(null)
    },
    click(e) {
      if (!isActive) return
      placeCenter(e.latlng)
    },
  })

  return null
}

export default function ExploreRadiusMapLayer() {
  const {
    isActive,
    selectedMiles,
    circleCenter,
    placedCenter,
    showPlaceHint,
    option,
  } = useExploreRadius()

  const radiusMeters = selectedMiles * MILES_TO_METERS

  const pathOptions = {
    color: option.stroke,
    fillColor: option.fill,
    fillOpacity: option.fillOpacity,
    weight: 'weight' in option ? option.weight : 2,
    dashArray: 'dashArray' in option ? option.dashArray : undefined,
  }

  return (
    <>
      <MapInvalidateSize />
      <RadiusMapEvents />
      {isActive && circleCenter && (
        <Circle
          center={circleCenter}
          radius={radiusMeters}
          pathOptions={pathOptions}
        />
      )}
      {isActive && showPlaceHint && placedCenter && (
        <Popup position={placedCenter} closeButton={false}>
          <div className="text-center text-[14px] text-black">
            <p className="font-semibold">Viewpoints in this area</p>
            <p className="text-[#666]">
              (preview — search not wired yet)
            </p>
          </div>
        </Popup>
      )}
    </>
  )
}
