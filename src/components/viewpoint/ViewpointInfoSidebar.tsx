import ViewpointInfoRow from './ViewpointInfoRow'

type ViewpointInfoSidebarProps = {
  bestTime: string
  tags: string[]
  distance: string
  difficulty: string
  estimatedVisit: string
}

export default function ViewpointInfoSidebar({
  bestTime,
  tags,
  distance,
  difficulty,
  estimatedVisit,
}: ViewpointInfoSidebarProps) {
  return (
    <aside className="flex w-full flex-col gap-4 lg:w-[357px] lg:shrink-0">
      <div className="flex flex-col gap-8 rounded-lg bg-[#d9d9d9] p-6">
        <ViewpointInfoRow icon="clock">
          <p>Best time: {bestTime}</p>
        </ViewpointInfoRow>
        <ViewpointInfoRow icon="tag">
          <p>Tags: {tags.join(', ')}</p>
        </ViewpointInfoRow>
      </div>

      <div className="rounded-lg bg-[#d9d9d9] p-6">
        <ViewpointInfoRow icon="walk">
          <div className="space-y-4">
            <p>Distance: {distance}</p>
            <p>Difficulty: {difficulty}</p>
            <p>Estimated visit: {estimatedVisit}</p>
          </div>
        </ViewpointInfoRow>
      </div>
    </aside>
  )
}
