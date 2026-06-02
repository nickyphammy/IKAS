import Navbar from '../layout/Navbar'
import PageBackground from '../layout/PageBackground'
import PageContainer from '../layout/PageContainer'
import HeroContent from './HeroContent'
import HeroGallery from './HeroGallery'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-x-clip">
      <PageBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <PageContainer>
          <Navbar />
        </PageContainer>

        <PageContainer className="flex flex-1 flex-col items-start gap-12 pb-16 pt-12 sm:gap-16 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:pt-24">
          <HeroContent />
          <HeroGallery />
        </PageContainer>
      </div>
    </section>
  )
}
