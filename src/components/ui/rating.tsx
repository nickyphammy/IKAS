import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingBadgeProps {
  rating: number | null | undefined
  count?: number
  className?: string
}

export function RatingBadge({ rating, count, className }: RatingBadgeProps) {
  if (rating == null) return null
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-900 shadow-sm',
        className,
      )}
    >
      <Star className="h-3.5 w-3.5 fill-brand text-brand" />
      {rating.toFixed(1)}
      {count != null && count > 0 && (
        <span className="font-normal text-muted">({count})</span>
      )}
    </span>
  )
}

interface StarRatingInputProps {
  value: number
  onChange: (value: number) => void
  size?: 'sm' | 'md' | 'lg'
}

export function StarRatingInput({ value, onChange, size = 'md' }: StarRatingInputProps) {
  const sizeClass = size === 'sm' ? 'h-5 w-5' : size === 'lg' ? 'h-8 w-8' : 'h-6 w-6'
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="rounded transition-transform hover:scale-110"
          aria-label={`Rate ${star} stars`}
        >
          <Star
            className={cn(
              sizeClass,
              star <= value ? 'fill-brand text-brand' : 'text-slate-300',
            )}
          />
        </button>
      ))}
    </div>
  )
}

interface StarRatingDisplayProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
}

export function StarRatingDisplay({ rating, size = 'md' }: StarRatingDisplayProps) {
  const sizeClass = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-7 w-7' : 'h-5 w-5'
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClass,
              star <= Math.round(rating) ? 'fill-brand text-brand' : 'text-slate-300',
            )}
          />
        ))}
      </div>
      <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
    </div>
  )
}
