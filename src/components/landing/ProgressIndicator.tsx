type ProgressIndicatorProps = {
  total?: number
  activeIndex?: number
}

export default function ProgressIndicator({
  total = 3,
  activeIndex = 0,
}: ProgressIndicatorProps) {
  return (
    <div className="flex gap-1" role="tablist" aria-label="Gallery progress">
      {Array.from({ length: total }, (_, index) => (
        <div
          key={index}
          role="tab"
          aria-selected={index === activeIndex}
          className={`h-[11px] w-[63px] ${
            index === activeIndex ? 'bg-[#0004ff]' : 'bg-black'
          }`}
        />
      ))}
    </div>
  )
}
