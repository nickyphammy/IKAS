import type { InputHTMLAttributes } from 'react'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: string
  iconAlt?: string
  label: string
}

export default function TextField({
  icon,
  iconAlt = '',
  label,
  id,
  className = '',
  ...props
}: TextFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="relative">
      {icon && (
        <img
          src={icon}
          alt={iconAlt}
          className="pointer-events-none absolute left-5 top-1/2 size-[27px] -translate-y-1/2"
          aria-hidden={!iconAlt}
        />
      )}
      <input
        id={fieldId}
        placeholder={label}
        className={`motion-focus h-14 w-full rounded-lg bg-[rgba(217,217,217,0.8)] pl-12 pr-4 text-[16px] text-black placeholder:text-black focus:outline-none focus:ring-2 focus:ring-[#ff9a76] ${className}`}
        {...props}
      />
    </div>
  )
}
