import { PageContainer } from '@/components/layout/PageShell'
import { ViewpointCard } from '@/components/home/ViewpointCard'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { useGeolocation, useRecommendedViewpoints, useViewpoints } from '@/hooks/use-viewpoints'
import { haversineDistanceMiles } from '@/lib/geo'
import type { Viewpoint } from '@/types'

function sortByDistance(viewpoints: Viewpoint[], lat: number, lng: number) {
  return [...viewpoints]
    .map((vp) => ({
      ...vp,
      distance_miles: haversineDistanceMiles(lat, lng, vp.latitude, vp.longitude),
    }))
    .sort((a, b) => (a.distance_miles ?? 0) - (b.distance_miles ?? 0))
}

export default function HomePage() {
  const { data: recommended, isLoading: loadingRecs } = useRecommendedViewpoints()
  const { data: allViewpoints, isLoading: loadingAll } = useViewpoints()
  const { data: location, isError: locationError } = useGeolocation()

  const nearby =
    location && allViewpoints
      ? sortByDistance(allViewpoints, location.lat, location.lng).slice(0, 6)
      : []

  return (
    <PageContainer>
      <section>
        <h1 className="text-2xl font-bold md:text-3xl">Recommended for you</h1>
        <p className="mt-1 text-muted">Top-rated scenic spots from the community</p>
        <div className="mt-6">
          {loadingRecs ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-72 w-64 shrink-0" />
              ))}
            </div>
          ) : recommended && recommended.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {recommended.map((vp) => (
                <ViewpointCard
                  key={vp.id}
                  viewpoint={vp}
                  userLat={location?.lat}
                  userLng={location?.lng}
                  className="w-72 shrink-0"
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No recommendations yet"
              description="Once viewpoints are added, the best-rated spots will appear here."
              actionLabel="Add the first spot"
              actionTo="/add-viewpoint"
            />
          )}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold">Nearby gems</h2>
        <p className="mt-1 text-sm text-muted">
          {locationError
            ? 'Enable location access to see spots near you'
            : location
              ? 'Scenic spots sorted by distance'
              : 'Getting your location…'}
        </p>
        <div className="mt-6">
          {loadingAll ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : nearby.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {nearby.map((vp) => (
                <ViewpointCard
                  key={vp.id}
                  viewpoint={vp}
                  userLat={location?.lat}
                  userLng={location?.lng}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No nearby spots"
              description={
                locationError
                  ? 'Allow location access in your browser to discover viewpoints near you.'
                  : 'No viewpoints have been added yet. Be the first to share a spot!'
              }
              actionLabel="Add a viewpoint"
              actionTo="/add-viewpoint"
            />
          )}
        </div>
      </section>
    </PageContainer>
  )
}
