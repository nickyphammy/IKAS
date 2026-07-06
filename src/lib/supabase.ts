import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true
  return (
    value.includes('your-project') ||
    value.includes('your-anon-key') ||
    value === 'https://your-project.supabase.co'
  )
}

function isSecretKey(value: string | undefined): boolean {
  return Boolean(value?.startsWith('sb_secret_'))
}

export function getSupabaseConfigError(): string | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    return 'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env'
  }
  if (isPlaceholder(supabaseUrl) || isPlaceholder(supabaseAnonKey)) {
    return 'Replace placeholder values in .env with your real Supabase credentials'
  }
  if (isSecretKey(supabaseAnonKey)) {
    return 'Use the anon/public key in .env — not the secret (sb_secret_) key'
  }
  return null
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfigError() === null
}

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null
  if (!client) {
    client = createClient(supabaseUrl!, supabaseAnonKey!)
  }
  return client
}
