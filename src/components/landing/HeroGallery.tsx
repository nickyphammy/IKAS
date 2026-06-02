import LocationCard, { landingGallerySpots } from './LocationCard'

export default function HeroGallery() {
  const [heroSpot, sideSpot, miniSpot] = landingGallerySpots

  return (
    <div className="motion-fade-in relative h-[440px] w-full min-w-0 max-w-[560px] sm:h-[520px] lg:h-[560px]">
      <div className="absolute left-4 top-8 h-[340px] w-[300px] rotate-[-8deg] rounded-[28px] bg-[#fff7ef]/70 shadow-[0_20px_60px_rgba(0,0,0,0.16)] sm:left-8 sm:h-[416px] sm:w-[368px]" />
      <LocationCard
        variant="hero"
        className="left-8 top-4 z-20 rotate-[-5deg] sm:left-14 lg:left-12"
        {...heroSpot}
      />
      <LocationCard
        variant="side"
        className="right-3 top-24 z-30 rotate-[7deg] sm:right-8 lg:right-4"
        {...sideSpot}
      />
      <LocationCard
        variant="mini"
        className="bottom-6 left-32 z-40 rotate-[4deg] sm:left-48 lg:left-52"
        {...miniSpot}
      />
      <div className="absolute right-8 top-4 z-50 rounded-full bg-[#ff9e43] px-4 py-2 text-[16px] font-bold text-black shadow-[0_12px_30px_rgba(255,126,16,0.35)]">
        fresh picks
      </div>
    </div>
  )
}
