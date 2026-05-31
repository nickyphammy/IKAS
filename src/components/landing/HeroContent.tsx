import Button from '../ui/Button'

export default function HeroContent() {
  return (
    <div className="mx-auto w-full max-w-[663px] text-center">
      <h1 className="text-4xl font-bold leading-tight text-black sm:text-6xl lg:text-[96px] lg:leading-[1.1]">
        See Somewhere New
      </h1>
      <p className="mx-auto mt-8 max-w-[575px] text-xl leading-normal text-black sm:mt-10 sm:text-2xl">
        Discover hidden overlooks, sunset spots, and cinematic scenery shared by
        explorers near you.
      </p>
      <div className="mt-10 flex justify-center sm:mt-12">
        <Button
          to="/signup"
          variant="cta"
          className="h-[59px] min-w-[240px] text-xl"
        >
          get started
        </Button>
      </div>
    </div>
  )
}
