import NearbyGemsSection from '../components/home/NearbyGemsSection'
import RecommendedSection from '../components/home/RecommendedSection'
import AppPageShell from '../components/layout/AppPageShell'
import { asset } from '../lib/asset'

export default function HomePage() {
  return (
    <AppPageShell background={asset('assets/home/hero-bg.png')}>
      <RecommendedSection />
      <NearbyGemsSection />
    </AppPageShell>
  )
}
