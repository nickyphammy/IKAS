import AppNavBar from '../components/layout/AppNavBar'
import PageBackground from '../components/layout/PageBackground'
import PageContainer from '../components/layout/PageContainer'
import SavedViewpointsSection from '../components/saved/SavedViewpointsSection'

export default function SavedPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <PageBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <AppNavBar />

        <PageContainer className="flex-1 pt-8 lg:pt-12">
          <SavedViewpointsSection />
        </PageContainer>
      </div>
    </main>
  )
}
