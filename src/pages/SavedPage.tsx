import AppNavBar from '../components/layout/AppNavBar'
import SavedViewpointsSection from '../components/saved/SavedViewpointsSection'
import { asset } from '../lib/asset'

export default function SavedPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-white" />
        <img
          src={asset('assets/saved/hero-bg.png')}
          alt=""
          className="absolute inset-0 size-full object-cover object-center"
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <AppNavBar />

        <div className="flex-1 pt-8 lg:pt-12">
          <SavedViewpointsSection />
        </div>
      </div>
    </main>
  )
}
