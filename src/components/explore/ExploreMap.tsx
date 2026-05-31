import { asset } from '../../lib/asset'

export default function ExploreMap() {
  return (
    <div className="absolute inset-0">
      <img
        src={asset('assets/explore/map.png')}
        alt="Map of viewpoints"
        className="size-full object-cover object-center"
      />
    </div>
  )
}
