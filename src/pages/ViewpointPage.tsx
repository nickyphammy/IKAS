import AppNavBar from '../components/layout/AppNavBar'
import ViewpointDetails from '../components/viewpoint/ViewpointDetails'
import ViewpointGallery from '../components/viewpoint/ViewpointGallery'

const viewpoint = {
  name: 'Laguna Ridge Sunset Point',
  rating: 4.3,
  address: '2784 Ridge view Trail, Laguna Beach, CA',
  latitude: 57.71,
  longitude: 11.91,
  description:
    'Laguna Ridge Sunset Point is a quiet scenic overlook with a wide view of the coastline, city lights, and ocean horizon. It is best visited around sunset when the sky changes colors and the view becomes more photogenic. This spot is good for casual hangouts, date nights, photography, and short visits with friends. Parking is limited nearby, so visitors should plan to arrive early.',
  image: '/assets/viewpoint/hero-image.png',
  bestTime: 'Sunset',
  tags: ['Ocean View', 'Date Spot', 'Photography', 'Peaceful'],
  distance: '4.2 miles away',
  difficulty: 'Easy walk',
  estimatedVisit: '30–45 minutes',
}

export default function ViewpointPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-white" />
        <img
          src="/assets/viewpoint/hero-bg.png"
          alt=""
          className="absolute inset-0 size-full object-cover object-center"
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <AppNavBar />

        <div className="mx-auto w-full max-w-[1436px] flex-1 px-4 pb-10 pt-6 lg:px-6">
          <ViewpointGallery
            image={viewpoint.image}
            alt={viewpoint.name}
            bestTime={viewpoint.bestTime}
            tags={viewpoint.tags}
            distance={viewpoint.distance}
            difficulty={viewpoint.difficulty}
            estimatedVisit={viewpoint.estimatedVisit}
          />

          <ViewpointDetails
            name={viewpoint.name}
            rating={viewpoint.rating}
            address={viewpoint.address}
            latitude={viewpoint.latitude}
            longitude={viewpoint.longitude}
            description={viewpoint.description}
          />
        </div>
      </div>
    </main>
  )
}
