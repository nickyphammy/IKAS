import NearbyGemsSection from '../components/home/NearbyGemsSection'
import RecommendedSection from '../components/home/RecommendedSection'
import AppNavBar from '../components/layout/AppNavBar'
import PageBackground from '../components/layout/PageBackground'
import PageContainer from '../components/layout/PageContainer'

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <PageBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <AppNavBar />

        <PageContainer className="flex-1 pt-5 lg:pt-8">
          <RecommendedSection />
          <NearbyGemsSection />
        </PageContainer>
      </div>
    </main>
  )
}
