import { asset } from '../../lib/asset'
import ExploreRadiusTool from './ExploreRadiusTool'

export default function ExploreMap() {
  return (
    <div className="absolute inset-0">
      <img
        src={asset('assets/explore/map.png')}
        alt="Map of viewpoints"
        className="size-full object-cover object-center"
      />
      <ExploreRadiusTool />
    </div>
  )
}
