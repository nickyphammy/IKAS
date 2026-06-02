import Button from '../ui/Button'

export default function HeroContent() {
  return (
    <div className="motion-fade-in w-full min-w-0 max-w-[663px]">
      <h1 className="text-[24px] font-bold leading-tight text-black sm:text-[48px] lg:text-[64px] lg:leading-[1.1]">
        See Somewhere New
      </h1>
      <p className="mt-6 max-w-[575px] text-[16px] leading-normal text-black sm:mt-8">
        Discover hidden overlooks, sunset spots, and cinematic scenery shared by
        explorers near you.
      </p>
      <div className="mt-8">
        <Button
          to="/signup"
          variant="cta"
          className="h-12 min-w-[216px] text-[16px]"
        >
          get started
        </Button>
      </div>
    </div>
  )
}
