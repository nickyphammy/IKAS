import { useState } from 'react'
import FormLabel from './FormLabel'

type StarRatingProps = {
  value?: number
  onChange?: (value: number) => void
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill={filled ? '#ff9e43' : '#d9d9d9'}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
    </svg>
  )
}

export default function StarRating({ value = 4, onChange }: StarRatingProps) {
  const [rating, setRating] = useState(value)

  function handleSelect(star: number) {
    setRating(star)
    onChange?.(star)
  }

  return (
    <div>
      <FormLabel required>rate it</FormLabel>
      <div className="flex gap-2" role="radiogroup" aria-label="Rating">
        {Array.from({ length: 5 }, (_, index) => {
          const star = index + 1
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={rating >= star}
              aria-label={`${star} star${star === 1 ? '' : 's'}`}
              onClick={() => handleSelect(star)}
              className="rounded transition duration-150 hover:-translate-y-0.5 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#ff9e43] active:scale-95"
            >
              <StarIcon filled={star <= rating} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
