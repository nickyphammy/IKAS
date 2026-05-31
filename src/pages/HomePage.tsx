import NearbyGemsSection from '../components/home/NearbyGemsSection'
import RecommendedSection from '../components/home/RecommendedSection'
import AppNavBar from '../components/layout/AppNavBar'

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-white" />
        <img
          src="/assets/home/hero-bg.png"
          alt=""
          className="absolute inset-0 size-full object-cover object-center"
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <AppNavBar active="home" />

        <div className="flex-1 pt-8 lg:pt-12">
          <RecommendedSection />
          <NearbyGemsSection />
        </div>
      </div>
    </main>
  )
}
