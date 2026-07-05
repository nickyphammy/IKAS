import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LandingNavbar } from '@/components/layout/LandingNavbar'
import { PageContainer, PageShell } from '@/components/layout/PageShell'
import { useRecommendedViewpoints } from '@/hooks/use-viewpoints'
import { APP_TAGLINE } from '@/lib/constants'
import { ViewpointCard } from '@/components/home/ViewpointCard'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'

export default function LandingPage() {
  const { data: recent, isLoading } = useRecommendedViewpoints()

  return (
    <PageShell>
      <LandingNavbar />
      <PageContainer className="py-12 md:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand">
              {APP_TAGLINE}
            </p>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              See somewhere new
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted">
              Discover hidden overlooks, sunset spots, and cinematic scenery shared by explorers
              near you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/signup">Get started</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/explore">Explore map</Link>
              </Button>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -left-4 top-8 h-64 w-48 rotate-[-6deg] rounded-2xl bg-gradient-to-br from-brand/20 to-orange-100 shadow-lg" />
            <div className="absolute left-16 top-0 h-72 w-56 rotate-[3deg] rounded-2xl bg-gradient-to-br from-slate-200 to-slate-100 shadow-xl" />
            <div className="relative ml-24 mt-16 h-80 w-64 rotate-[-2deg] overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-brand-dark shadow-2xl">
              <div className="flex h-full flex-col justify-end p-6 text-white">
                <span className="text-xs font-medium uppercase tracking-wider opacity-80">
                  Fresh picks
                </span>
                <span className="text-xl font-bold">Your next favorite view</span>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-20">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold">Recent viewpoints</h2>
              <p className="text-sm text-muted">Community spots added recently</p>
            </div>
          </div>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : recent && recent.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recent.slice(0, 3).map((vp) => (
                <ViewpointCard key={vp.id} viewpoint={vp} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No viewpoints yet"
              description="Be the first to share a scenic spot with the community."
              actionLabel="Add a viewpoint"
              actionTo="/signup"
            />
          )}
        </section>
      </PageContainer>
    </PageShell>
  )
}
