import NearbyGemsSection from '../components/home/NearbyGemsSection'
import RecommendedSection from '../components/home/RecommendedSection'
import AppNavBar from '../components/layout/AppNavBar'
import PageContainer from '../components/layout/PageContainer'
import { asset } from '../lib/asset'

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-white" />
        <img
          src={asset('assets/home/hero-bg.png')}
          alt=""
          className="absolute inset-0 size-full object-cover object-center"
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <AppNavBar />

        <PageContainer className="flex-1 pt-8 lg:pt-12">
          <RecommendedSection />
          <NearbyGemsSection />
        </PageContainer>
      </div>
    </main>
  )
}
