import { Link } from 'react-router-dom'

type ArrowButtonProps = {
  label: string
  className?: string
  to?: string
}

export default function ArrowButton({
  label,
  className = '',
  to,
}: ArrowButtonProps) {
  const classes = `flex size-[68px] shrink-0 items-center justify-center rounded-full bg-[#ff9a76] transition-colors hover:bg-[#ff8860] active:bg-[#ff764a] ${className}`

  const arrow = (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M5 12H19M19 12L13 6M19 12L13 18"
        stroke="white"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )

  if (to) {
    return (
      <Link to={to} aria-label={label} className={classes}>
        {arrow}
      </Link>
    )
  }

  return (
    <button type="button" aria-label={label} className={classes}>
      {arrow}
    </button>
  )
}
