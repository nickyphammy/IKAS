import AppPageShell from '../components/layout/AppPageShell'
import SavedViewpointsSection from '../components/saved/SavedViewpointsSection'
import { asset } from '../lib/asset'

export default function SavedPage() {
  return (
    <AppPageShell background={asset('assets/saved/hero-bg.png')}>
      <SavedViewpointsSection />
    </AppPageShell>
  )
}
