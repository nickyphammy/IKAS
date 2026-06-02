import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import RatingBadge from '../components/home/RatingBadge'
import AppNavBar from '../components/layout/AppNavBar'
import PageBackground from '../components/layout/PageBackground'
import PageContainer from '../components/layout/PageContainer'
import { asset } from '../lib/asset'

const dailyRecs = [
  {
    name: 'Crystal Cove Shore',
    image: asset('assets/home/recommended-1.png'),
    alt: 'Tropical beach with turquoise water',
    rating: '4.8',
    distance: '8.4 mi',
    tag: 'morning swim',
    description: 'Turquoise shallows, soft sand, and a quiet early-day coastline.',
  },
  {
    name: 'Heisler Park Cove',
    image: asset('assets/home/recommended-2.png'),
    alt: 'Rocky coastline at sunset',
    rating: '4.6',
    distance: '10.2 mi',
    tag: 'golden hour',
    description: 'Cliffside paths, tide pools, and warm sunset views over the water.',
  },
  {
    name: 'Newport Pier Lookout',
    image: asset('assets/home/recommended-3.png'),
    alt: 'Sandy beach from elevated view',
    rating: '4.4',
    distance: '3.4 mi',
    tag: 'easy access',
    description: 'A bright elevated view of the shoreline with nearby pier access.',
  },
  {
    name: 'Laguna Ridge Sunset Point',
    image: asset('assets/home/nearby-1.png'),
    alt: 'City skyline at sunset from a ridge overlook',
    rating: '4.3',
    distance: '4.2 mi',
    tag: 'city lights',
    description: 'A ridge overlook with coastline color and a strong sunset payoff.',
  },
] as const

function getStackOffset(index: number, activeIndex: number) {
  return (index - activeIndex + dailyRecs.length) % dailyRecs.length
}

export default function DailyRecsPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const visibleCards = useMemo(
    () =>
      dailyRecs.map((rec, index) => ({
        ...rec,
        stackOffset: getStackOffset(index, activeIndex),
      })),
    [activeIndex],
  )

  const activeRec = dailyRecs[activeIndex]

  function showNextRec() {
    setActiveIndex((current) => {
      if (current === dailyRecs.length - 1) {
        setIsComplete(true)
        return current
      }

      return current + 1
    })
  }

  function startOver() {
    setActiveIndex(0)
    setIsComplete(false)
  }

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <PageBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <AppNavBar />

        <PageContainer className="flex-1 py-8">
          <section className="motion-fade-in mx-auto flex w-full max-w-[1040px] flex-col gap-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[16px] font-bold text-[#ff7f10]">
                  daily recommendations
                </p>
                <h1 className="text-[24px] font-bold text-black sm:text-[32px]">
                  Today&apos;s stack
                </h1>
              </div>

              {!isComplete && (
                <p className="text-[16px] text-black/70">
                  {activeIndex + 1} / {dailyRecs.length}
                </p>
              )}
            </div>

            {isComplete ? (
              <div className="motion-fade-in mx-auto flex min-h-[360px] w-full max-w-[480px] flex-col items-center justify-center rounded-[24px] bg-white/80 px-6 py-10 text-center shadow-xl backdrop-blur-sm">
                <p className="mb-2 text-[16px] font-bold text-[#ff7f10]">
                  all caught up
                </p>
                <h2 className="mb-3 text-[24px] font-bold text-black">
                  Come back tomorrow to view more
                </h2>
                <p className="mb-6 text-[16px] leading-snug text-black/70">
                  Today&apos;s recommendations are done. A fresh stack will be
                  waiting for your next check-in.
                </p>
                <button
                  type="button"
                  onClick={startOver}
                  className="motion-press rounded-[24px] bg-[#ff9e43] px-5 py-2 text-[16px] font-bold text-black hover:bg-[#ff8f2a]"
                >
                  start from beginning
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-center lg:justify-center">
                <div className="relative h-[480px] w-full max-w-[360px] sm:h-[520px] sm:max-w-[400px]">
                  {visibleCards.map((rec) => {
                    const isActive = rec.stackOffset === 0
                    const isHidden = rec.stackOffset > 2
                    const translateY = rec.stackOffset * 18
                    const scale = 1 - rec.stackOffset * 0.045
                    const rotate = rec.stackOffset * -2

                    return (
                      <article
                        key={rec.name}
                        className={`motion-pop group absolute inset-0 overflow-hidden rounded-[24px] bg-white shadow-xl transition duration-300 ${
                          isActive ? 'z-30' : rec.stackOffset === 1 ? 'z-20' : 'z-10'
                        } ${isHidden ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
                        style={{
                          transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
                        }}
                      >
                        <Link to="/viewpoint" className="block h-[62%] overflow-hidden">
                          <img
                            src={rec.image}
                            alt={rec.alt}
                            className="motion-image size-full object-cover"
                          />
                        </Link>

                        <div className="flex h-[38%] flex-col gap-3 px-5 py-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[16px] text-black/60">
                                {rec.tag} - {rec.distance}
                              </p>
                              <Link
                                to="/viewpoint"
                                className="text-[24px] font-bold leading-tight text-black transition duration-200 hover:text-[#ff7f10]"
                              >
                                {rec.name}
                              </Link>
                            </div>
                            <RatingBadge rating={rec.rating} compact />
                          </div>

                          <p className="line-clamp-3 text-[16px] leading-snug text-black/75">
                            {rec.description}
                          </p>
                        </div>
                      </article>
                    )
                  })}
                </div>

                <div className="flex w-full max-w-[360px] justify-end lg:w-auto lg:max-w-none">
                  <button
                    type="button"
                    onClick={showNextRec}
                    className="motion-press flex size-16 items-center justify-center rounded-full bg-[#ff9e43] text-[24px] font-bold text-black hover:bg-[#ff8f2a]"
                    aria-label={`Show next recommendation after ${activeRec.name}`}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            )}
          </section>
        </PageContainer>
      </div>
    </main>
  )
}
