import AddViewpointForm from '../components/add-viewpoint/AddViewpointForm'
import AppPageShell from '../components/layout/AppPageShell'
import { asset } from '../lib/asset'

export default function AddViewpointPage() {
  return (
    <AppPageShell
      background={asset('assets/add-viewpoint/hero-bg.png')}
      contentClassName="justify-center pb-10"
    >
      <AddViewpointForm />
    </AppPageShell>
  )
}
