import { useMemo, useState } from 'react'
import { PageContainer } from '@/components/layout/PageShell'
import { ViewpointCard } from '@/components/home/ViewpointCard'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useSavedViewpoints } from '@/hooks/use-viewpoints'
import { Search } from 'lucide-react'

export default function SavedPage() {
  const { data: saved, isLoading } = useSavedViewpoints()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!saved) return []
    const term = search.trim().toLowerCase()
    if (!term) return saved
    return saved.filter(
      (vp) =>
        vp.name.toLowerCase().includes(term) ||
        vp.address.toLowerCase().includes(term) ||
        vp.description.toLowerCase().includes(term),
    )
  }, [saved, search])

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold md:text-3xl">Saved viewpoints</h1>
      <p className="mt-1 text-muted">Spots you&apos;ve bookmarked for later</p>

      <div className="relative mt-6 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search saved spots…"
          className="pl-10"
        />
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((vp) => (
              <ViewpointCard key={vp.id} viewpoint={vp} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={search ? 'No matches found' : 'Nothing saved yet'}
            description={
              search
                ? 'Try a different search term.'
                : 'Save spots you love from any viewpoint page to find them here.'
            }
            actionLabel={search ? undefined : 'Explore viewpoints'}
            actionTo={search ? undefined : '/explore'}
          />
        )}
      </div>
    </PageContainer>
  )
}
