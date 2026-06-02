/** Matches public/assets/home/hero-bg.png — CSS gradient avoids image seam glitches at the bottom. */
export default function PageBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 min-h-full ika-page-gradient"
      aria-hidden
    />
  )
}
