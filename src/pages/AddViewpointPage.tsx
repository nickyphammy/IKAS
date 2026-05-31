import AddViewpointForm from '../components/add-viewpoint/AddViewpointForm'
import AppNavBar from '../components/layout/AppNavBar'
import { asset } from '../lib/asset'

export default function AddViewpointPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-white" />
        <img
          src={asset('assets/add-viewpoint/hero-bg.png')}
          alt=""
          className="absolute inset-0 size-full object-cover object-center"
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <AppNavBar />

        <div className="flex flex-1 items-center justify-center px-4 py-10">
          <AddViewpointForm />
        </div>
      </div>
    </main>
  )
}
