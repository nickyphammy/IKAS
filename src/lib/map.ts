import L from 'leaflet'

/** Clean, light tiles similar to Apple Maps */
export const MAP_TILE_URL =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'

export const MAP_TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

export const viewpointMarkerIcon = L.divIcon({
  className: '',
  html: '<div style="width:16px;height:16px;background:#ff8c42;border:2.5px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.25)"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

export const userLocationIcon = L.divIcon({
  className: '',
  html: `<div style="position:relative;width:28px;height:28px">
    <div style="position:absolute;inset:0;background:rgba(0,122,255,0.18);border-radius:50%"></div>
    <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:14px;height:14px;background:#007AFF;border:2.5px solid white;border-radius:50%;box-shadow:0 1px 6px rgba(0,0,0,0.25)"></div>
  </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

export const pickerMarkerIcon = L.divIcon({
  className: '',
  html: `<div style="width:32px;height:32px;position:relative">
    <div style="position:absolute;left:50%;top:4px;width:22px;height:22px;margin-left:-11px;background:#ff8c42;border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 3px 10px rgba(0,0,0,0.3)"></div>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 26],
})
