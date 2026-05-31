type ViewpointStarRatingProps = {
  rating: number
  max?: number
}

function StarIcon({ filled, size }: { filled: boolean; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? '#1D1B20' : 'none'}
      stroke="#1D1B20"
      strokeWidth="1.5"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
    </svg>
  )
}

export default function ViewpointStarRating({
  rating,
  max = 5,
}: ViewpointStarRatingProps) {
  return (
    <div className="flex items-center gap-5">
      <div className="flex items-center gap-[19px]" aria-label={`Rating ${rating} out of ${max}`}>
        {Array.from({ length: max }, (_, index) => (
          <StarIcon
            key={index}
            filled={index < Math.round(rating)}
            size={48}
          />
        ))}
      </div>
      <span className="text-[32px] font-bold text-black">{rating.toFixed(1)}</span>
    </div>
  )
}
