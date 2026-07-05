import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Viewpoint, ViewpointWithStats } from '@/types'

function mapViewpoint(row: ViewpointWithStats): Viewpoint {
  return {
    id: row.id,
    created_by: row.created_by,
    name: row.name,
    description: row.description,
    address: row.address,
    latitude: row.latitude,
    longitude: row.longitude,
    best_time: row.best_time,
    difficulty: row.difficulty,
    estimated_visit: row.estimated_visit,
    image_url: row.image_url,
    created_at: row.created_at,
    updated_at: row.updated_at,
    avg_rating: row.avg_rating,
    rating_count: row.rating_count,
    tags: row.tags ?? [],
  }
}

export async function getViewpoints(filters?: {
  search?: string
  centerLat?: number
  centerLng?: number
  radiusMiles?: number
  limit?: number
}): Promise<Viewpoint[]> {
  if (!isSupabaseConfigured()) return []

  const supabase = getSupabase()!
  let query = supabase.from('viewpoints_with_stats').select('*')

  if (filters?.search) {
    const term = filters.search.trim()
    query = query.or(
      `name.ilike.%${term}%,address.ilike.%${term}%,description.ilike.%${term}%`,
    )
  }

  if (
    filters?.centerLat != null &&
    filters?.centerLng != null &&
    filters?.radiusMiles != null
  ) {
    const { data, error } = await supabase.rpc('viewpoints_within_radius', {
      center_lat: filters.centerLat,
      center_lng: filters.centerLng,
      radius_miles: filters.radiusMiles,
    })
    if (error) throw error
    return (data as ViewpointWithStats[]).map(mapViewpoint)
  }

  query = query.order('created_at', { ascending: false })
  if (filters?.limit) query = query.limit(filters.limit)

  const { data, error } = await query
  if (error) throw error
  return (data as ViewpointWithStats[]).map(mapViewpoint)
}

export async function getRecommendedViewpoints(limit = 12): Promise<Viewpoint[]> {
  if (!isSupabaseConfigured()) return []

  const supabase = getSupabase()!
  const { data, error } = await supabase
    .from('viewpoints_with_stats')
    .select('*')
    .order('avg_rating', { ascending: false, nullsFirst: false })
    .order('rating_count', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data as ViewpointWithStats[]).map(mapViewpoint)
}

export async function getViewpointById(id: string): Promise<Viewpoint | null> {
  if (!isSupabaseConfigured()) return null

  const supabase = getSupabase()!
  const { data, error } = await supabase
    .from('viewpoints_with_stats')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data ? mapViewpoint(data as ViewpointWithStats) : null
}

export async function getDailyRecs(limit = 4): Promise<Viewpoint[]> {
  if (!isSupabaseConfigured()) return []

  const supabase = getSupabase()!
  const { data, error } = await supabase
    .from('viewpoints_with_stats')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(Math.max(limit * 3, 12))

  if (error) throw error
  const shuffled = [...(data as ViewpointWithStats[])].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, limit).map(mapViewpoint)
}

export async function createViewpoint(
  input: import('@/types').CreateViewpointInput,
  userId: string,
): Promise<Viewpoint> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase is not configured')

  const { data, error } = await supabase
    .from('viewpoints')
    .insert({
      created_by: userId,
      name: input.name,
      description: input.description,
      address: input.address,
      latitude: input.latitude,
      longitude: input.longitude,
      best_time: input.best_time ?? null,
      difficulty: input.difficulty ?? null,
      estimated_visit: input.estimated_visit ?? null,
      image_url: input.image_url ?? null,
    })
    .select('*')
    .single()

  if (error) throw error

  if (input.tags?.length) {
    await setViewpointTags(data.id, input.tags)
  }

  if (input.initial_rating) {
    await upsertRating(data.id, userId, input.initial_rating)
  }

  const viewpoint = await getViewpointById(data.id)
  if (!viewpoint) throw new Error('Failed to load created viewpoint')
  return viewpoint
}

async function setViewpointTags(viewpointId: string, tagNames: string[]) {
  const supabase = getSupabase()!
  for (const name of tagNames) {
    const trimmed = name.trim()
    if (!trimmed) continue

    const { data: tag } = await supabase
      .from('tags')
      .upsert({ name: trimmed }, { onConflict: 'name' })
      .select('id')
      .single()

    if (tag) {
      await supabase
        .from('viewpoint_tags')
        .upsert({ viewpoint_id: viewpointId, tag_id: tag.id })
    }
  }
}

export async function uploadViewpointImage(file: File, userId: string): Promise<string> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase is not configured')

  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${userId}/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage.from('viewpoint-images').upload(path, file, {
    upsert: false,
  })
  if (error) throw error

  const { data } = supabase.storage.from('viewpoint-images').getPublicUrl(path)
  return data.publicUrl
}

export async function upsertRating(
  viewpointId: string,
  userId: string,
  rating: number,
): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase is not configured')

  const { error } = await supabase.from('viewpoint_ratings').upsert(
    { viewpoint_id: viewpointId, user_id: userId, rating },
    { onConflict: 'viewpoint_id,user_id' },
  )
  if (error) throw error
}

export async function getUserRating(
  viewpointId: string,
  userId: string,
): Promise<number | null> {
  if (!isSupabaseConfigured()) return null

  const supabase = getSupabase()!
  const { data, error } = await supabase
    .from('viewpoint_ratings')
    .select('rating')
    .eq('viewpoint_id', viewpointId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return data?.rating ?? null
}

export async function getSavedViewpoints(userId: string): Promise<Viewpoint[]> {
  if (!isSupabaseConfigured()) return []

  const supabase = getSupabase()!
  const { data: savedRows, error: savedError } = await supabase
    .from('saved_viewpoints')
    .select('viewpoint_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (savedError) throw savedError
  if (!savedRows?.length) return []

  const ids = savedRows.map((row) => row.viewpoint_id)
  const { data, error } = await supabase
    .from('viewpoints_with_stats')
    .select('*')
    .in('id', ids)

  if (error) throw error

  const byId = new Map((data as ViewpointWithStats[]).map((vp) => [vp.id, mapViewpoint(vp)]))
  return ids.map((id) => byId.get(id)).filter((v): v is Viewpoint => v != null)
}

export async function toggleSavedViewpoint(
  userId: string,
  viewpointId: string,
): Promise<boolean> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase is not configured')

  const { data: existing } = await supabase
    .from('saved_viewpoints')
    .select('viewpoint_id')
    .eq('user_id', userId)
    .eq('viewpoint_id', viewpointId)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('saved_viewpoints')
      .delete()
      .eq('user_id', userId)
      .eq('viewpoint_id', viewpointId)
    if (error) throw error
    return false
  }

  const { error } = await supabase
    .from('saved_viewpoints')
    .insert({ user_id: userId, viewpoint_id: viewpointId })
  if (error) throw error
  return true
}

export async function isViewpointSaved(
  userId: string,
  viewpointId: string,
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false

  const supabase = getSupabase()!
  const { data, error } = await supabase
    .from('saved_viewpoints')
    .select('viewpoint_id')
    .eq('user_id', userId)
    .eq('viewpoint_id', viewpointId)
    .maybeSingle()

  if (error) throw error
  return Boolean(data)
}
