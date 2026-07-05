import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Profile } from '@/types'

export async function getProfile(userId: string): Promise<Profile | null> {
  if (!isSupabaseConfigured()) return null

  const supabase = getSupabase()!
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function ensureProfile(userId: string, displayName?: string): Promise<Profile> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase is not configured')

  const existing = await getProfile(userId)
  if (existing) return existing

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      display_name: displayName ?? null,
    })
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, 'display_name' | 'avatar_url'>>,
): Promise<Profile> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase is not configured')

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select('*')
    .single()

  if (error) throw error
  return data
}
