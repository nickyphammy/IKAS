import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Bookmark, Clock, Flag, MapPin, Mountain, Sun } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { StarRatingDisplay, StarRatingInput } from '@/components/ui/rating'
import {
  useIsSaved,
  useToggleSaved,
  useUpsertRating,
  useUserRating,
  useViewpoint,
} from '@/hooks/use-viewpoints'
import { useAuth } from '@/app/auth-context'

export default function ViewpointPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { data: viewpoint, isLoading } = useViewpoint(id)
  const { data: isSaved } = useIsSaved(id)
  const { data: userRating } = useUserRating(id)
  const toggleSaved = useToggleSaved()
  const upsertRating = useUpsertRating()
  const [reported, setReported] = useState(false)

  if (isLoading) {
    return (
      <PageContainer>
        <Skeleton className="h-80 w-full" />
        <Skeleton className="mt-6 h-32 w-full" />
      </PageContainer>
    )
  }

  if (!viewpoint) {
    return (
      <PageContainer className="text-center">
        <h1 className="text-2xl font-bold">Viewpoint not found</h1>
        <Button asChild className="mt-4">
          <Link to="/home">Back to home</Link>
        </Button>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl bg-slate-100">
            {viewpoint.image_url ? (
              <img
                src={viewpoint.image_url}
                alt={viewpoint.name}
                className="aspect-[16/10] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-brand-light to-orange-50">
                <MapPin className="h-16 w-16 text-brand/30" />
              </div>
            )}
          </div>

          <div className="mt-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{viewpoint.name}</h1>
                <p className="mt-2 flex items-center gap-1.5 text-muted">
                  <MapPin className="h-4 w-4" />
                  {viewpoint.address}
                </p>
              </div>
              <div className="flex gap-2">
                {id && (
                  user ? (
                    <Button
                      variant={isSaved ? 'default' : 'secondary'}
                      size="sm"
                      onClick={() => toggleSaved.mutate(id)}
                      disabled={toggleSaved.isPending}
                    >
                      <Bookmark className="h-4 w-4" />
                      {isSaved ? 'Saved' : 'Save'}
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm" asChild>
                      <Link to="/login" state={{ from: `/viewpoint/${id}` }}>
                        <Bookmark className="h-4 w-4" />
                        Save
                      </Link>
                    </Button>
                  )
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReported(true)}
                  disabled={reported}
                >
                  <Flag className="h-4 w-4" />
                  {reported ? 'Reported' : 'Report'}
                </Button>
              </div>
            </div>

            {viewpoint.avg_rating != null && (
              <div className="mt-4">
                <StarRatingDisplay rating={viewpoint.avg_rating} size="lg" />
                {viewpoint.rating_count != null && viewpoint.rating_count > 0 && (
                  <p className="mt-1 text-sm text-muted">
                    Based on {viewpoint.rating_count} rating{viewpoint.rating_count !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            )}

            {user && id ? (
              <div className="mt-6 rounded-2xl border border-border bg-white p-5">
                <p className="mb-2 text-sm font-medium">Your rating</p>
                <StarRatingInput
                  value={userRating ?? 0}
                  onChange={(rating) => upsertRating.mutate({ viewpointId: id, rating })}
                  size="lg"
                />
              </div>
            ) : (
              <p className="mt-6 text-sm text-muted">
                <Link to="/login" state={{ from: `/viewpoint/${id}` }} className="font-semibold text-brand hover:underline">
                  Log in
                </Link>{' '}
                to rate this spot
              </p>
            )}

            <p className="mt-6 leading-relaxed text-slate-700">{viewpoint.description}</p>

            <p className="mt-4 text-xs text-muted">
              {viewpoint.latitude.toFixed(4)}, {viewpoint.longitude.toFixed(4)}
            </p>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="font-semibold">Spot details</h2>
            <dl className="mt-4 space-y-4">
              {viewpoint.best_time && (
                <div className="flex items-center gap-3">
                  <Sun className="h-5 w-5 text-brand" />
                  <div>
                    <dt className="text-xs text-muted">Best time</dt>
                    <dd className="font-medium">{viewpoint.best_time}</dd>
                  </div>
                </div>
              )}
              {viewpoint.difficulty && (
                <div className="flex items-center gap-3">
                  <Mountain className="h-5 w-5 text-brand" />
                  <div>
                    <dt className="text-xs text-muted">Difficulty</dt>
                    <dd className="font-medium">{viewpoint.difficulty}</dd>
                  </div>
                </div>
              )}
              {viewpoint.estimated_visit && (
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-brand" />
                  <div>
                    <dt className="text-xs text-muted">Visit duration</dt>
                    <dd className="font-medium">{viewpoint.estimated_visit}</dd>
                  </div>
                </div>
              )}
            </dl>
          </div>

          {viewpoint.tags && viewpoint.tags.length > 0 && (
            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="font-semibold">Tags</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {viewpoint.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-brand-light px-3 py-1 text-sm font-medium text-brand"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </PageContainer>
  )
}
