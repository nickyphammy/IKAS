import Button from '../ui/Button'

export default function HeroContent() {
  return (
    <div className="max-w-[663px]">
      <h1 className="text-5xl font-bold leading-tight text-black sm:text-7xl lg:text-[96px] lg:leading-[1.1]">
        See Somewhere New
      </h1>
      <p className="mt-10 max-w-[575px] text-2xl leading-normal text-black">
        Discover hidden overlooks, sunset spots, and cinematic scenery shared by
        explorers near you.
      </p>
      <div className="mt-12">
        <Button variant="cta" className="h-[59px] min-w-[240px] text-xl">
          get started
        </Button>
      </div>
    </div>
  )
}
