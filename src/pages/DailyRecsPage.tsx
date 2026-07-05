import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { RatingBadge } from '@/components/ui/rating'
import { Skeleton } from '@/components/ui/skeleton'
import { useDailyRecs } from '@/hooks/use-viewpoints'
import { cn } from '@/lib/utils'

export default function DailyRecsPage() {
  const { data: recs, isLoading } = useDailyRecs()
  const [index, setIndex] = useState(0)

  const complete = recs != null && index >= recs.length
  const current = recs?.[index]

  if (isLoading) {
    return (
      <PageContainer className="flex min-h-[60vh] items-center justify-center">
        <Skeleton className="h-96 w-80" />
      </PageContainer>
    )
  }

  if (!recs || recs.length === 0) {
    return (
      <PageContainer>
        <EmptyState
          title="No daily picks yet"
          description="Check back when more scenic spots have been added to the community."
          actionLabel="Explore map"
          actionTo="/explore"
        />
      </PageContainer>
    )
  }

  if (complete) {
    return (
      <PageContainer className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold">All caught up!</h2>
        <p className="mt-2 text-muted">Come back tomorrow for fresh recommendations.</p>
        <Button className="mt-6" onClick={() => setIndex(0)}>
          Start from beginning
        </Button>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="flex min-h-[60vh] flex-col items-center justify-center">
      <p className="mb-6 text-sm font-medium text-muted">
        {index + 1} / {recs.length}
      </p>
      <div className="relative h-[420px] w-full max-w-sm">
        {recs.slice(index + 1, index + 3).map((rec, i) => (
          <div
            key={rec.id}
            className="absolute inset-0 rounded-2xl bg-slate-200 shadow-md"
            style={{
              transform: `scale(${0.95 - i * 0.03}) translateY(${(i + 1) * 12}px)`,
              zIndex: 10 - i,
            }}
          />
        ))}
        <Link
          to={`/viewpoint/${current!.id}`}
          className={cn(
            'absolute inset-0 z-20 block overflow-hidden rounded-2xl border border-border bg-white shadow-xl transition',
          )}
        >
          <div className="relative h-56 bg-slate-100">
            {current!.image_url ? (
              <img src={current!.image_url} alt={current!.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-light to-orange-50 text-brand">
                No photo
              </div>
            )}
            {current!.avg_rating != null && (
              <div className="absolute right-3 top-3">
                <RatingBadge rating={current!.avg_rating} />
              </div>
            )}
          </div>
          <div className="p-5">
            <h3 className="text-xl font-bold">{current!.name}</h3>
            <p className="mt-2 line-clamp-3 text-sm text-muted">{current!.description}</p>
            {current!.tags && current!.tags[0] && (
              <span className="mt-3 inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">
                {current!.tags[0]}
              </span>
            )}
          </div>
        </Link>
      </div>
      <Button
        size="icon"
        className="mt-8 h-14 w-14 rounded-full"
        onClick={() => setIndex((i) => i + 1)}
        aria-label="Next recommendation"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </PageContainer>
  )
}
