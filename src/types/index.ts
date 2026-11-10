export interface Profile {
  id: string
  display_name: string | null
  avatar_url: string | null
  created_at: string
}

export interface Viewpoint {
  id: string
  created_by: string
  name: string
  description: string
  address: string
  latitude: number
  longitude: number
  image_url: string | null
  photo_credit?: PhotoCredit | null
  created_at: string
  updated_at: string
  avg_rating?: number | null
  rating_count?: number
  tags?: string[]
  distance_miles?: number
}

/** Attribution for a freely licensed photo (CC BY / CC BY-SA require showing it). */
export interface PhotoCredit {
  author: string
  license: string
  license_url: string | null
  source_url: string | null
}

export interface ViewpointRating {
  id: string
  viewpoint_id: string
  user_id: string
  rating: number
  created_at: string
}

export interface SavedViewpoint {
  user_id: string
  viewpoint_id: string
  created_at: string
  viewpoint?: Viewpoint
}

export interface ExploreFilters {
  search?: string
  centerLat?: number
  centerLng?: number
  radiusMiles?: number
}

export interface CreateViewpointInput {
  name: string
  description: string
  address: string
  latitude: number
  longitude: number
  image_url?: string | null
  tags?: string[]
  initial_rating?: number
}

export interface ViewpointRow {
  id: string
  created_by: string
  name: string
  description: string
  address: string
  latitude: number
  longitude: number
  image_url: string | null
  // Null for user-submitted viewpoints, and absent until the attribution migration is applied.
  image_author?: string | null
  image_license?: string | null
  image_license_url?: string | null
  image_source_url?: string | null
  created_at: string
  updated_at: string
}

export interface ViewpointWithStats extends ViewpointRow {
  avg_rating: number | null
  rating_count: number
  tags: string[]
}
