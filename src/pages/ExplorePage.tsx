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

      <PageContainer className="pointer-events-none absolute inset-x-0 top-20 z-30 flex justify-center sm:top-[88px]">
        <div className="pointer-events-auto w-full max-w-[831px] px-4">
          <ExploreSearchBar />
        </div>
      </PageContainer>
    </main>
  )
}
