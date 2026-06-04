import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { LatLngExpression } from 'leaflet'

export const RADIUS_OPTIONS = [
  {
    miles: 5,
    ringClass: 'border-[#ff9e43] bg-[#ff9e43]/25',
    labelClass: 'bg-[#ff9e43]',
    stroke: '#ff9e43',
    fill: '#ff9e43',
    fillOpacity: 0.25,
  },
  {
    miles: 10,
    ringClass: 'border-[#ff9a76] bg-[#ff9a76]/20',
    labelClass: 'bg-[#ff9a76]',
    stroke: '#ff9a76',
    fill: '#ff9a76',
    fillOpacity: 0.2,
  },
  {
    miles: 50,
    ringClass: 'border-[#0004ff] bg-[#0004ff]/15 border-dashed',
    labelClass: 'bg-[#0004ff]',
    stroke: '#0004ff',
    fill: '#0004ff',
    fillOpacity: 0.15,
    dashArray: '8 6',
  },
  {
    miles: 100,
    ringClass: 'border-black/70 bg-white/25 border-[3px]',
    labelClass: 'bg-black',
    stroke: '#000000',
    fill: '#ffffff',
    fillOpacity: 0.25,
    weight: 3,
  },
] as const

export type RadiusMiles = (typeof RADIUS_OPTIONS)[number]['miles']

type ExploreRadiusContextValue = {
  isActive: boolean
  selectedMiles: RadiusMiles
  cursorLatLng: LatLngExpression | null
  placedCenter: LatLngExpression | null
  showPlaceHint: boolean
  option: (typeof RADIUS_OPTIONS)[number]
  circleCenter: LatLngExpression | null
  setSelectedMiles: (miles: RadiusMiles) => void
  setCursorLatLng: (latlng: LatLngExpression | null) => void
  placeCenter: (latlng: LatLngExpression) => void
  handleToggle: () => void
  handleClearPlacement: () => void
}

const ExploreRadiusContext = createContext<ExploreRadiusContextValue | null>(
  null,
)

export function ExploreRadiusProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false)
  const [selectedMiles, setSelectedMiles] = useState<RadiusMiles>(10)
  const [cursorLatLng, setCursorLatLng] = useState<LatLngExpression | null>(
    null,
  )
  const [placedCenter, setPlacedCenter] = useState<LatLngExpression | null>(
    null,
  )
  const [showPlaceHint, setShowPlaceHint] = useState(false)

  const option =
    RADIUS_OPTIONS.find((o) => o.miles === selectedMiles) ?? RADIUS_OPTIONS[1]

  const circleCenter = placedCenter ?? cursorLatLng

  const placeCenter = useCallback((latlng: LatLngExpression) => {
    setPlacedCenter(latlng)
    setCursorLatLng(latlng)
    setShowPlaceHint(true)
  }, [])

  const handleToggle = useCallback(() => {
    setIsActive((prev) => {
      if (prev) {
        setCursorLatLng(null)
        setPlacedCenter(null)
        setShowPlaceHint(false)
      }
      return !prev
    })
  }, [])

  const handleClearPlacement = useCallback(() => {
    setPlacedCenter(null)
    setShowPlaceHint(false)
  }, [])

  const value = useMemo(
    () => ({
      isActive,
      selectedMiles,
      cursorLatLng,
      placedCenter,
      showPlaceHint,
      option,
      circleCenter,
      setSelectedMiles,
      setCursorLatLng,
      placeCenter,
      handleToggle,
      handleClearPlacement,
    }),
    [
      isActive,
      selectedMiles,
      cursorLatLng,
      placedCenter,
      showPlaceHint,
      option,
      circleCenter,
      placeCenter,
      handleToggle,
      handleClearPlacement,
    ],
  )

  return (
    <ExploreRadiusContext.Provider value={value}>
      {children}
    </ExploreRadiusContext.Provider>
  )
}

export function useExploreRadius() {
  const ctx = useContext(ExploreRadiusContext)
  if (!ctx) {
    throw new Error('useExploreRadius must be used within ExploreRadiusProvider')
  }
  return ctx
}
