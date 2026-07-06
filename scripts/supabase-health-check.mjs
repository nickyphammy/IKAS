#!/usr/bin/env node
/**
 * Run: node scripts/supabase-health-check.mjs
 * Checks .env file and Supabase API connectivity.
 */

import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

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

function check(name, ok, detail) {
  const icon = ok ? '✓' : '✗'
  console.log(`${icon} ${name}${detail ? `: ${detail}` : ''}`)
  return ok
}

async function main() {
  console.log('IKAS Supabase Health Check\n')

  if (!existsSync(envPath)) {
    check('.env file exists', false, 'Create .env from .env.example')
    process.exit(1)
  }

  const size = readFileSync(envPath).length
  if (!check('.env file saved (not empty)', size > 0, `${size} bytes on disk`)) {
    console.log('\n→ Save .env in your editor (Cmd+S) — unsaved changes are not loaded by Vite.')
    process.exit(1)
  }

  const env = parseEnv(readFileSync(envPath, 'utf8'))
  const url = env.VITE_SUPABASE_URL
  const key = env.VITE_SUPABASE_ANON_KEY

  check('VITE_SUPABASE_URL set', Boolean(url))
  check('VITE_SUPABASE_ANON_KEY set', Boolean(key))

  if (url?.includes('your-project')) {
    check('URL is not a placeholder', false)
  }

  if (key?.startsWith('sb_secret_')) {
    check('Key is anon/public (not secret)', false, 'sb_secret_ keys must NOT be used in the frontend')
    console.log('\n→ Use "anon public" (eyJ...) or "publishable" (sb_publishable_...) from Project Settings → API')
  } else if (key?.startsWith('eyJ') || key?.startsWith('sb_publishable_')) {
    check('Key format looks correct', true)
  } else if (key?.includes('your-anon')) {
    check('Key is not a placeholder', false)
  }

  if (!url || !key) {
    process.exit(1)
  }

  console.log('\nTesting API connectivity...')
  try {
    const res = await fetch(`${url}/rest/v1/`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    })
    check('Supabase REST API reachable', res.status === 200 || res.status === 401, `HTTP ${res.status}`)
  } catch (err) {
    check('Supabase REST API reachable', false, err.message)
  }

  console.log('\nIf all checks pass, restart the dev server: npm run dev')
}

main()
