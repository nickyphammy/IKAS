import { createContext, useContext, useState, type ReactNode } from 'react'
import type { RadiusMiles } from '@/lib/constants'

interface ExploreRadiusContextValue {
  radiusMode: boolean
  setRadiusMode: (enabled: boolean) => void
  radiusMiles: RadiusMiles
  setRadiusMiles: (miles: RadiusMiles) => void
  center: { lat: number; lng: number } | null
  setCenter: (center: { lat: number; lng: number } | null) => void
}

const ExploreRadiusContext = createContext<ExploreRadiusContextValue | null>(null)

export function ExploreRadiusProvider({ children }: { children: ReactNode }) {
  const [radiusMode, setRadiusMode] = useState(false)
  const [radiusMiles, setRadiusMiles] = useState<RadiusMiles>(10)
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null)

  return (
    <ExploreRadiusContext.Provider
      value={{ radiusMode, setRadiusMode, radiusMiles, setRadiusMiles, center, setCenter }}
    >
      {children}
    </ExploreRadiusContext.Provider>
  )
}

export function useExploreRadius() {
  const ctx = useContext(ExploreRadiusContext)
  if (!ctx) throw new Error('useExploreRadius must be used within ExploreRadiusProvider')
  return ctx
}
