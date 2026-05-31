import ExploreMap from '../components/explore/ExploreMap'
import ExploreSearchBar from '../components/explore/ExploreSearchBar'
import AppNavBar from '../components/layout/AppNavBar'

export default function ExplorePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <ExploreMap />

      <div className="relative z-20">
        <AppNavBar />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-[134px] z-30 flex justify-center px-4">
        <div className="pointer-events-auto w-full max-w-[831px]">
          <ExploreSearchBar />
        </div>
      </div>
    </main>
  )
}
