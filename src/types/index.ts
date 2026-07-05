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
  best_time: string | null
  difficulty: string | null
  estimated_visit: string | null
  image_url: string | null
  created_at: string
  updated_at: string
  avg_rating?: number | null
  rating_count?: number
  tags?: string[]
  distance_miles?: number
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
  best_time?: string
  difficulty?: string
  estimated_visit?: string
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
  best_time: string | null
  difficulty: string | null
  estimated_visit: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface ViewpointWithStats extends ViewpointRow {
  avg_rating: number | null
  rating_count: number
  tags: string[]
}
