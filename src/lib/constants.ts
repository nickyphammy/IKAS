export const APP_NAME = 'IKAS'
export const APP_TAGLINE = 'I KNOW A SPOT'

export const DEFAULT_MAP_CENTER = { lat: 33.6846, lng: -117.8265 }
export const DEFAULT_MAP_ZOOM = 10
/** Must be set on each MapContainer: the MapLibre basemap layer doesn't cap Leaflet's zoom. */
export const MAP_MAX_ZOOM = 20

export const RADIUS_OPTIONS = [5, 10, 50, 100] as const
export type RadiusMiles = (typeof RADIUS_OPTIONS)[number]

export const DIFFICULTY_OPTIONS = ['Easy walk', 'Moderate hike', 'Challenging'] as const
export const BEST_TIME_OPTIONS = ['Sunrise', 'Morning', 'Afternoon', 'Sunset', 'Night'] as const
