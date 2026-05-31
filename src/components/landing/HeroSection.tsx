import PageContent from '../layout/PageContent'
import Navbar from '../layout/Navbar'
import { asset } from '../../lib/asset'
import HeroContent from './HeroContent'
import HeroGallery from './HeroGallery'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 top-[3px]">
        <img
          src={asset('assets/landing/hero-bg.png')}
          alt=""
          className="size-full object-cover object-center"
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <PageContent>
          <Navbar />
        </PageContent>

        <PageContent className="flex flex-1 flex-col items-center justify-center gap-12 pb-16 pt-12 sm:gap-16 lg:flex-row lg:items-center lg:gap-8 lg:pt-24">
          <HeroContent />
          <HeroGallery />
        </PageContent>
      </div>
    </section>
  )
}
