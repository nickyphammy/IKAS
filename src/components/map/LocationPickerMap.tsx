import { useEffect, useState } from 'react'
import { MapContainer, Marker, useMapEvents } from 'react-leaflet'
import { MapTileLayer } from '@/components/map/MapTileLayer'
import { UserLocationLayer } from '@/components/map/UserLocationLayer'
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '@/lib/constants'
import { pickerMarkerIcon } from '@/lib/map'

interface LocationPickerMapProps {
  latitude: number | null
  longitude: number | null
  onLocationChange: (lat: number, lng: number) => void
}

function MapClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

function DraggablePin({
  latitude,
  longitude,
  onLocationChange,
}: {
  latitude: number
  longitude: number
  onLocationChange: (lat: number, lng: number) => void
}) {
  return (
    <Marker
      position={[latitude, longitude]}
      icon={pickerMarkerIcon}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const { lat, lng } = e.target.getLatLng()
          onLocationChange(lat, lng)
        },
      }}
    />
  )
}

export function LocationPickerMap({
  latitude,
  longitude,
  onLocationChange,
}: LocationPickerMapProps) {
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    setMapReady(true)
  }, [])

  const hasPin = latitude != null && longitude != null

  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <p className="border-b border-border bg-slate-50 px-4 py-2 text-xs text-muted">
        Tap the map or drag the pin to set the viewpoint location
      </p>
      <div className="h-64 w-full">
        {mapReady && (
          <MapContainer
            center={
              hasPin ? [latitude, longitude] : [DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng]
            }
            zoom={hasPin ? 14 : DEFAULT_MAP_ZOOM}
            className="h-full w-full"
            scrollWheelZoom
          >
            <MapTileLayer />
            <UserLocationLayer flyToOnLoad={!hasPin} zoom={14} />
            <MapClickHandler onLocationChange={onLocationChange} />
            {hasPin && (
              <DraggablePin
                latitude={latitude}
                longitude={longitude}
                onLocationChange={onLocationChange}
              />
            )}
          </MapContainer>
        )}
      </div>
      {hasPin && (
        <div className="border-t border-border bg-white px-4 py-2 text-xs text-muted">
          {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </div>
      )}
    </div>
  )
}
