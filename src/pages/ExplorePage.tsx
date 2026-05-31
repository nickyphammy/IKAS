import ExploreMap from '../components/explore/ExploreMap'
import ExploreSearchBar from '../components/explore/ExploreSearchBar'
import AppNavBar from '../components/layout/AppNavBar'
import PageContainer from '../components/layout/PageContainer'

export default function ExplorePage() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <ExploreMap />

      <div className="relative z-20">
        <AppNavBar />
      </div>

      <PageContainer className="pointer-events-none absolute inset-x-0 top-[120px] z-30 sm:top-[134px]">
        <div className="pointer-events-auto w-full max-w-[831px]">
          <ExploreSearchBar />
        </div>
      </PageContainer>
    </main>
  )
}
