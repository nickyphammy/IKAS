import ExploreMap from '../components/explore/ExploreMap'
import ExploreSearchBar from '../components/explore/ExploreSearchBar'
import AppNavBar from '../components/layout/AppNavBar'
import PageContent from '../components/layout/PageContent'

export default function ExplorePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <ExploreMap />

      <div className="relative z-20">
        <PageContent>
          <AppNavBar />
        </PageContent>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-[120px] z-30 sm:top-[134px]">
        <PageContent className="flex justify-center">
          <div className="pointer-events-auto w-full max-w-[831px]">
            <ExploreSearchBar />
          </div>
        </PageContent>
      </div>
    </main>
  )
}
