#!/usr/bin/env node
/**
 * Clears all IKAS app data from Supabase.
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env (Project Settings → API → service_role).
 *
 * Run: npm run clear-db
 */

import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'

const envPath = resolve(process.cwd(), '.env')

function parseEnv(content) {
  const vars = {}
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    vars[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim()
  }
  return vars
}

const ZERO = '00000000-0000-0000-0000-000000000000'

async function deleteAll(supabase, table, column = 'id') {
  const { error, count } = await supabase
    .from(table)
    .delete({ count: 'exact' })
    .neq(column, ZERO)
  if (error) throw new Error(`${table}: ${error.message}`)
  return count ?? 0
}

async function clearStorageBucket(supabase, bucket) {
  let removed = 0
  const { data: topLevel, error: listError } = await supabase.storage.from(bucket).list('', {
    limit: 1000,
  })
  if (listError) throw new Error(`storage list: ${listError.message}`)
  if (!topLevel?.length) return 0

  for (const entry of topLevel) {
    if (entry.id) {
      const { data: nested } = await supabase.storage.from(bucket).list(entry.name, { limit: 1000 })
      if (nested?.length) {
        const paths = nested.map((f) => `${entry.name}/${f.name}`)
        const { error } = await supabase.storage.from(bucket).remove(paths)
        if (error) throw new Error(`storage remove: ${error.message}`)
        removed += paths.length
      }
    }
  }
  return removed
}

async function clearAuthUsers(supabase) {
  let removed = 0
  let page = 1
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 100 })
    if (error) throw new Error(`auth list: ${error.message}`)
    const users = data.users ?? []
    if (!users.length) break
    for (const user of users) {
      const { error: delError } = await supabase.auth.admin.deleteUser(user.id)
      if (delError) throw new Error(`auth delete ${user.id}: ${delError.message}`)
      removed++
    }
    if (users.length < 100) break
    page++
  }
  return removed
}

async function main() {
  if (!existsSync(envPath)) {
    console.error('Missing .env file')
    process.exit(1)
  }

  const env = parseEnv(readFileSync(envPath, 'utf8'))
  const url = env.VITE_SUPABASE_URL
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY

  if (!url) {
    console.error('Missing VITE_SUPABASE_URL in .env')
    process.exit(1)
  }
  if (!serviceKey) {
    console.error(
      'Missing SUPABASE_SERVICE_ROLE_KEY in .env\n' +
        'Add it from Supabase → Project Settings → API → service_role (secret)\n' +
        'Never commit this key or use it in frontend code.',
    )
    process.exit(1)
  }
  if (serviceKey.startsWith('sb_secret_') === false && !serviceKey.startsWith('eyJ')) {
    console.warn('Warning: key may not be a service role key')
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  console.log('Connecting to Supabase…')
  console.log('Clearing tables…')

  const saved = await deleteAll(supabase, 'saved_viewpoints', 'user_id')
  console.log(`  saved_viewpoints: ${saved} rows`)

  const ratings = await deleteAll(supabase, 'viewpoint_ratings', 'id')
  console.log(`  viewpoint_ratings: ${ratings} rows`)

  const vtags = await deleteAll(supabase, 'viewpoint_tags', 'viewpoint_id')
  console.log(`  viewpoint_tags: ${vtags} rows`)

  const viewpoints = await deleteAll(supabase, 'viewpoints', 'id')
  console.log(`  viewpoints: ${viewpoints} rows`)

  const tags = await deleteAll(supabase, 'tags', 'id')
  console.log(`  tags: ${tags} rows`)

  const profiles = await deleteAll(supabase, 'profiles', 'id')
  console.log(`  profiles: ${profiles} rows`)

  console.log('Clearing storage bucket…')
  const files = await clearStorageBucket(supabase, 'viewpoint-images')
  console.log(`  viewpoint-images: ${files} files`)

  console.log('Clearing auth users…')
  const users = await clearAuthUsers(supabase)
  console.log(`  auth.users: ${users} users`)

  console.log('\nDone — all app data cleared.')
}

main().catch((err) => {
  console.error('\nFailed:', err.message)
  process.exit(1)
})
