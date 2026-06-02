import type { ReactNode } from 'react'

type FormLabelProps = {
  children: ReactNode
  required?: boolean
  optional?: boolean
}

export default function FormLabel({
  children,
  required,
  optional,
}: FormLabelProps) {
  return (
    <label className="mb-2 block text-[16px] font-bold text-black">
      {children}
      {required && <span className="text-red-600"> *</span>}
      {optional && (
        <span className="ml-1 text-[16px] font-normal text-[#9f9f9f]">
          (optional)
        </span>
      )}
    </label>
  )
}
