import AddViewpointForm from '../components/add-viewpoint/AddViewpointForm'
import AppNavBar from '../components/layout/AppNavBar'
import PageBackground from '../components/layout/PageBackground'

export default function AddViewpointPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <PageBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <AppNavBar />

        <div className="flex flex-1 items-center justify-center px-4 py-10">
          <AddViewpointForm />
        </div>
      </div>
    </main>
  )
}
