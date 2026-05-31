import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type ButtonVariant = 'accent' | 'cta' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  children: ReactNode
  to?: string
}

const variantClasses: Record<ButtonVariant, string> = {
  accent:
    'bg-[#ff9e43] text-black font-bold hover:bg-[#ff8f2a] active:bg-[#ff7f10]',
  cta: 'bg-[#ff9a76] text-white font-bold hover:bg-[#ff8860] active:bg-[#ff764a]',
  ghost: 'bg-transparent text-black font-normal hover:opacity-80',
}

export default function Button({
  variant = 'cta',
  className = '',
  children,
  type = 'button',
  to,
  ...props
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center rounded-lg px-6 py-2.5 text-xl transition-colors ${variantClasses[variant]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}
