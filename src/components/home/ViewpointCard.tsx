import { Link } from 'react-router-dom'
import type { Viewpoint } from '@/types'
import { RatingBadge } from '@/components/ui/rating'
import { cn } from '@/lib/utils'
import { formatDistance, haversineDistanceMiles } from '@/lib/geo'
import { MapPin } from 'lucide-react'

interface ViewpointCardProps {
  viewpoint: Viewpoint
  userLat?: number
  userLng?: number
  className?: string
}

export function ViewpointCard({ viewpoint, userLat, userLng, className }: ViewpointCardProps) {
  const distance =
    userLat != null && userLng != null
      ? formatDistance(
          haversineDistanceMiles(userLat, userLng, viewpoint.latitude, viewpoint.longitude),
        )
      : viewpoint.distance_miles != null
        ? formatDistance(viewpoint.distance_miles)
        : null

  return (
    <Link
      to={`/viewpoint/${viewpoint.id}`}
      className={cn(
        'group block overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:shadow-md',
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {viewpoint.image_url ? (
          <img
            src={viewpoint.image_url}
            alt={viewpoint.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-light to-orange-50">
            <MapPin className="h-12 w-12 text-brand/40" />
          </div>
        )}
        {viewpoint.avg_rating != null && (
          <div className="absolute right-3 top-3">
            <RatingBadge rating={viewpoint.avg_rating} count={viewpoint.rating_count} />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 group-hover:text-brand">{viewpoint.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{viewpoint.description}</p>
        {distance && (
          <p className="mt-2 text-xs font-medium text-brand">{distance}</p>
        )}
        {viewpoint.tags && viewpoint.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {viewpoint.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
