type RecommendedCardProps = {
  image: string
  alt: string
}

export default function RecommendedCard({ image, alt }: RecommendedCardProps) {
  return (
    <button
      type="button"
      className="h-[244px] w-full shrink-0 overflow-hidden rounded-[40px] sm:w-[289px]"
    >
      <img src={image} alt={alt} className="size-full object-cover" />
    </button>
  )
}
