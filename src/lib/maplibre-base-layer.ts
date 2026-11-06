import 'maplibre-gl/dist/maplibre-gl.css'
import { setWorkerUrl } from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import { maplibreGL } from '@maplibre/maplibre-gl-leaflet'
import { appleMapStyle } from '@/lib/map-style'

// MapLibre finds its worker relative to its own module URL, which breaks once
// Vite bundles it; point it at the worker file Vite emits instead.
setWorkerUrl(workerUrl)

/** Vector basemap rendered by MapLibre inside Leaflet's tile pane. Loaded lazily. */
export function createBaseLayer() {
  return maplibreGL({ style: appleMapStyle, attributionControl: false })
}
