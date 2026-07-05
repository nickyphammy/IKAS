import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useExploreRadius } from '@/components/explore/exploreRadiusContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RADIUS_OPTIONS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface ExploreControlsProps {
  search: string
  onSearchChange: (value: string) => void
}

export function ExploreControls({ search, onSearchChange }: ExploreControlsProps) {
  const { radiusMode, setRadiusMode, radiusMiles, setRadiusMiles, center } = useExploreRadius()

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[1000] p-4">
      <div className="pointer-events-auto mx-auto max-w-xl space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search viewpoints…"
            className="border-0 bg-white/95 pl-10 shadow-lg backdrop-blur"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white/95 p-3 shadow-lg backdrop-blur">
          <Button
            size="sm"
            variant={radiusMode ? 'default' : 'secondary'}
            onClick={() => setRadiusMode(!radiusMode)}
          >
            {radiusMode ? 'Cancel radius' : 'Search by radius'}
          </Button>
          {radiusMode && (
            <div className="flex gap-1">
              {RADIUS_OPTIONS.map((mi) => (
                <button
                  key={mi}
                  type="button"
                  onClick={() => setRadiusMiles(mi)}
                  className={cn(
                    'rounded-lg px-2.5 py-1 text-xs font-semibold transition',
                    radiusMiles === mi
                      ? 'bg-brand text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                  )}
                >
                  {mi} mi
                </button>
              ))}
            </div>
          )}
          <Button size="sm" variant="outline" asChild className="ml-auto">
            <Link to="/daily-recs">View recs</Link>
          </Button>
        </div>
        {radiusMode && (
          <p className="rounded-xl bg-white/90 px-3 py-2 text-center text-xs text-muted shadow">
            {center
              ? `Showing spots within ${radiusMiles} mi of selected point`
              : 'Click the map to set search center'}
          </p>
        )}
      </div>
    </div>
  )
}
