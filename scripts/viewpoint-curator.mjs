#!/usr/bin/env node
/**
 * IKAS viewpoint curator: finds public scenic spots and freely licensed photos, stages them for
 * human review, and publishes only approved ones to Supabase.
 *
 * Run: npm run curator -- <command> [options]
 *
 *   discover  [--region socal] [--types beach,mountain,…] [--limit 15] [--photo-only]
 *             Scenic places from Wikidata (CC0 data) not yet staged or published.
 *   lookup    "<place name>"                Find coordinates for a place found elsewhere on the web.
 *   photos    --lat <n> --lon <n> [--radius 1000] [--limit 12]
 *   photos    --file "File:Example.jpg"     Check one Wikimedia Commons file.
 *             Each photo comes back with a license verdict (allowed or rejected + reason).
 *   stage     --json '{"name","description","lat","lon","photo":"File:…"|null,"qid","tags":[…],"address"}'
 *             Re-verifies the photo license, geocodes the address, checks duplicates, saves for review.
 *   list      [--status staged|approved|published|rejected|all]
 *   approve   <id…>          Mark staged entries approved (only the owner should decide this).
 *   reject    <id…> [--reason "…"]
 *   setup                    Create the "IKAS Curator" account that owns imported viewpoints.
 *   publish   [--dry-run]    Upload approved photos + insert approved viewpoints.
 *
 * Photo license policy (enforced here, never left to judgment):
 *   allowed  public domain / CC0, CC BY (any version), CC BY-SA (any version)
 *   rejected NonCommercial (NC), NoDerivatives (ND), GFDL-only, non-free, unknown, license fields that
 *            disagree, any Commons restriction tag (personality rights, trademark, …), attribution
 *            licenses without an identified author (incl. uploader-only credits), and images under
 *            1000 px wide.
 * Photos come only from Wikimedia Commons, whose per-file license metadata is machine-readable.
 * Staging lives in .curator/ (git-ignored). publish needs SUPABASE_SERVICE_ROLE_KEY in .env.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomBytes } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

const UA = 'IKAS-curator/0.1 (https://github.com/nickyphammy/IKAS)'
const STATE_DIR = resolve(process.cwd(), '.curator')
const STAGING_PATH = resolve(STATE_DIR, 'staging.json')
const CONFIG_PATH = resolve(STATE_DIR, 'config.json')
const BUCKET = 'viewpoint-images'
const MIN_WIDTH = 1000
const DUPLICATE_RADIUS_MILES = 0.1

const REGIONS = {
  socal: { label: 'Southern California', south: 32.5, west: -120.5, north: 35.0, east: -114.1 },
}

// Wikidata classes for scenic places (instance of).
const TYPES = {
  viewpoint: 'Q6017969',
  mountain: 'Q8502',
  summit: 'Q207326',
  beach: 'Q40080',
  waterfall: 'Q34038',
  canyon: 'Q150784',
  point: 'Q185113',
  lighthouse: 'Q39715',
  pier: 'Q863454',
  tower: 'Q1440300',
  cliff: 'Q107679',
}

// ---------- small helpers ----------

function parseArgs(argv) {
  const positional = []
  const flags = {}
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const next = argv[i + 1]
      if (next === undefined || next.startsWith('--')) flags[key] = true
      else {
        flags[key] = next
        i++
      }
    } else positional.push(arg)
  }
  return { positional, flags }
}

function out(value) {
  console.log(JSON.stringify(value, null, 2))
}

function fail(message) {
  console.error(`Error: ${message}`)
  process.exit(1)
}

function readEnv() {
  const envPath = resolve(process.cwd(), '.env')
  const vars = {}
  if (!existsSync(envPath)) return vars
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    vars[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim()
  }
  return vars
}

function loadJson(path, fallback) {
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : fallback
}

function saveJson(path, value) {
  mkdirSync(STATE_DIR, { recursive: true })
  writeFileSync(path, JSON.stringify(value, null, 2) + '\n')
}

const loadStaging = () => loadJson(STAGING_PATH, [])
const saveStaging = (entries) => saveJson(STAGING_PATH, entries)

function stripHtml(html) {
  return String(html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function milesBetween(lat1, lon1, lat2, lon2) {
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return 3958.8 * 2 * Math.asin(Math.sqrt(a))
}

function regionFor(lat, lon) {
  return Object.entries(REGIONS).find(
    ([, r]) => lat >= r.south && lat <= r.north && lon >= r.west && lon <= r.east,
  )?.[0]
}

async function getJson(url, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: { 'User-Agent': UA, Accept: 'application/json', ...init.headers },
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url.split('?')[0]}`)
  return res.json()
}

let lastNominatim = 0
async function nominatim(path, params) {
  const wait = lastNominatim + 1100 - Date.now() // usage policy: max 1 request per second
  if (wait > 0) await new Promise((r) => setTimeout(r, wait))
  lastNominatim = Date.now()
  const qs = new URLSearchParams({ format: 'jsonv2', 'accept-language': 'en', ...params })
  return getJson(`https://nominatim.openstreetmap.org/${path}?${qs}`)
}

// ---------- license policy ----------

/** Decide whether a Commons file's extmetadata allows use in IKAS. Pure function. */
export function checkLicense(meta) {
  const v = (key) => stripHtml(meta?.[key]?.value)
  const code = v('License').toLowerCase()
  const short = v('LicenseShortName')
  const url = v('LicenseUrl') || null
  const restrictions = v('Restrictions')
  // Only the Artist field names the creator; Credit is usually "Own work" or a source, not an author.
  const author = v('Artist')
  const both = `${code} ${short.toLowerCase()}`

  const reject = (reason) => ({
    ok: false,
    reason,
    license: short || code || null,
    license_url: url,
    author: author || null,
  })

  if (v('NonFree') && v('NonFree').toLowerCase() !== 'false') return reject('marked non-free')
  if (/(^|[^a-z])nc([^a-z]|$)|non-?commercial/.test(both)) return reject('non-commercial license')
  if (/(^|[^a-z])nd([^a-z]|$)|no-?deriv/.test(both)) return reject('no-derivatives license')
  // Any Commons restriction tag (personality rights, trademark, insignia, costume, currency, …) is a reject.
  if (restrictions) return reject(`restricted file (${restrictions})`)

  // The machine-readable license code decides; the display name must not contradict it.
  const kindOf = (text, isCode) => {
    if (isCode) {
      if (text === 'cc0' || /^pd(-|$)/.test(text)) return 'public-domain'
      if (/^cc-by-sa-\d/.test(text)) return 'cc-by-sa'
      if (/^cc-by-\d/.test(text)) return 'cc-by'
      return null
    }
    if (/^cc0\b/i.test(text) || /^public domain\b/i.test(text)) return 'public-domain'
    if (/^cc by-sa \d/i.test(text)) return 'cc-by-sa'
    if (/^cc by \d/i.test(text)) return 'cc-by'
    return null
  }
  const kind = kindOf(code, true)
  if (!kind) return reject(`license not on the allowlist (${short || code || 'unknown'})`)
  if (short && kindOf(short, false) !== kind) {
    return reject(`license fields disagree (${code} vs "${short}")`)
  }

  if (kind !== 'public-domain') {
    if (!author) return reject('attribution license but no author to credit')
    if (
      /^(unknown( author)?|author unknown|anonymous|own work|see (below|description)|n\/?a)\.?$/i.test(
        author,
      )
    ) {
      return reject(`attribution license but author is not identified ("${author}")`)
    }
    if (/original uploader was|\bat [a-z -]*wikipedia\b/i.test(author)) {
      return reject('author unclear: only the uploader is recorded, not the photographer')
    }
    if (!url) return reject('attribution license but no license URL')
  }
  return {
    ok: true,
    reason: null,
    kind,
    license: short || (kind === 'public-domain' ? 'Public domain' : code.toUpperCase()),
    license_url: url,
    author: author || 'Unknown author',
  }
}

// ---------- Wikimedia Commons ----------

const EXTMETA =
  'License|LicenseShortName|LicenseUrl|Artist|Credit|Restrictions|NonFree|ImageDescription'

function commonsPageUrl(title) {
  return `https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`
}

function describeFile(page) {
  const info = page.imageinfo?.[0]
  if (!info) return { title: page.title, ok: false, reason: 'file not found on Wikimedia Commons' }
  let verdict = checkLicense(info.extmetadata)
  if (verdict.ok && !/^image\/(jpeg|png|webp)$/.test(info.mime))
    verdict = { ...verdict, ok: false, reason: `unsupported type ${info.mime}` }
  if (verdict.ok && info.width < MIN_WIDTH)
    verdict = { ...verdict, ok: false, reason: `too small (${info.width}px wide)` }
  return {
    title: page.title,
    ok: verdict.ok,
    reason: verdict.reason,
    kind: verdict.kind ?? null,
    license: verdict.license,
    license_url: verdict.license_url,
    author: verdict.author,
    page_url: commonsPageUrl(page.title),
    thumb_url: info.thumburl ?? info.url,
    width: info.width,
    height: info.height,
    description: stripHtml(info.extmetadata?.ImageDescription?.value).slice(0, 200),
  }
}

async function commonsQuery(params) {
  const qs = new URLSearchParams({
    action: 'query',
    format: 'json',
    prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata',
    iiurlwidth: '1600',
    iiextmetadatafilter: EXTMETA,
    ...params,
  })
  const data = await getJson(`https://commons.wikimedia.org/w/api.php?${qs}`)
  return Object.values(data.query?.pages ?? {})
}

async function checkCommonsFile(title) {
  const normalized = title.startsWith('File:')
    ? title
    : `File:${title.replace(/^.*\/(File:)?/, '')}`
  const [page] = await commonsQuery({ titles: normalized })
  return page
    ? describeFile(page)
    : { title: normalized, ok: false, reason: 'file not found on Wikimedia Commons' }
}

async function photosNear(lat, lon, radius, limit) {
  const pages = await commonsQuery({
    generator: 'geosearch',
    ggscoord: `${lat}|${lon}`,
    ggsradius: String(Math.min(Number(radius) || 1000, 10000)),
    ggsnamespace: '6',
    ggslimit: String(Math.min(Number(limit) || 12, 50)),
  })
  return pages
    .map(describeFile)
    .sort((a, b) => Number(b.ok) - Number(a.ok) || (b.width ?? 0) - (a.width ?? 0))
}

// ---------- Wikidata ----------

async function sparql(query) {
  const qs = new URLSearchParams({ query, format: 'json' })
  const data = await getJson(`https://query.wikidata.org/sparql?${qs}`, {
    headers: { Accept: 'application/sparql-results+json' },
  })
  return data.results.bindings
}

async function discover({ region = 'socal', types, limit = 15, photoOnly = false }) {
  const r = REGIONS[region]
  if (!r) fail(`unknown region "${region}" (known: ${Object.keys(REGIONS).join(', ')})`)
  const typeNames = types
    ? String(types)
        .split(',')
        .map((t) => t.trim())
    : Object.keys(TYPES)
  const unknown = typeNames.filter((t) => !TYPES[t])
  if (unknown.length)
    fail(`unknown type(s) ${unknown.join(', ')} (known: ${Object.keys(TYPES).join(', ')})`)
  const values = typeNames.map((t) => `wd:${TYPES[t]}`).join(' ')

  const rows = await sparql(`
    SELECT ?item ?itemLabel ?itemDescription ?coord ?image ?cls ?links WHERE {
      VALUES ?cls { ${values} }
      ?item wdt:P31 ?cls ; wikibase:sitelinks ?links .
      SERVICE wikibase:box {
        ?item wdt:P625 ?coord .
        bd:serviceParam wikibase:cornerSouthWest "Point(${r.west} ${r.south})"^^geo:wktLiteral .
        bd:serviceParam wikibase:cornerNorthEast "Point(${r.east} ${r.north})"^^geo:wktLiteral .
      }
      OPTIONAL { ?item wdt:P18 ?image }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    } ORDER BY DESC(?links) LIMIT 600`)

  const typeByQid = Object.fromEntries(Object.entries(TYPES).map(([k, q]) => [q, k]))
  const seen = new Set([
    ...loadStaging()
      .map((e) => e.source_id)
      .filter(Boolean),
    ...(await publishedSourceIds()),
  ])
  const results = []
  for (const row of rows) {
    const qid = row.item.value.split('/').pop()
    const name = row.itemLabel?.value
    if (seen.has(qid) || !name || name === qid) continue
    if (photoOnly && !row.image) continue
    const [lon, lat] = (row.coord.value.match(/Point\(([-\d.]+) ([-\d.]+)\)/) ?? [])
      .slice(1)
      .map((n) => Number(Number(n).toFixed(6)))
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue
    seen.add(qid)
    results.push({
      qid,
      name,
      type: typeByQid[row.cls.value.split('/').pop()],
      wikidata_description: row.itemDescription?.value ?? null,
      lat,
      lon,
      wikidata_photo: row.image
        ? `File:${decodeURIComponent(row.image.value.split('/').pop()).replace(/_/g, ' ')}`
        : null,
      wikidata: `https://www.wikidata.org/wiki/${qid}`,
    })
    if (results.length >= Number(limit)) break
  }
  return { region: r.label, count: results.length, candidates: results }
}

async function lookup(name) {
  const search = await getJson(
    `https://www.wikidata.org/w/api.php?${new URLSearchParams({ action: 'wbsearchentities', search: name, language: 'en', format: 'json', limit: '5' })}`,
  )
  const ids = search.search.map((s) => s.id)
  const wikidata = []
  if (ids.length) {
    const ents = await getJson(
      `https://www.wikidata.org/w/api.php?${new URLSearchParams({ action: 'wbgetentities', ids: ids.join('|'), props: 'claims|labels|descriptions', languages: 'en', format: 'json' })}`,
    )
    for (const id of ids) {
      const e = ents.entities[id]
      const coord = e?.claims?.P625?.[0]?.mainsnak?.datavalue?.value
      if (!coord) continue
      wikidata.push({
        qid: id,
        name: e.labels?.en?.value ?? name,
        description: e.descriptions?.en?.value ?? null,
        lat: coord.latitude,
        lon: coord.longitude,
        region: regionFor(coord.latitude, coord.longitude) ?? null,
        wikidata_photo: e.claims?.P18?.[0]?.mainsnak?.datavalue?.value
          ? `File:${e.claims.P18[0].mainsnak.datavalue.value}`
          : null,
      })
    }
  }
  const r = REGIONS.socal
  const osm = await nominatim('search', {
    q: name,
    countrycodes: 'us',
    limit: '5',
    viewbox: `${r.west},${r.north},${r.east},${r.south}`,
    bounded: '1',
  })
  return {
    wikidata,
    geocoder: osm.map((p) => ({
      name: p.name || p.display_name,
      display_name: p.display_name,
      lat: Number(p.lat),
      lon: Number(p.lon),
      type: p.type,
    })),
    note: 'Prefer a Wikidata match (pass its qid to stage). Geocoder results are only for coordinates.',
  }
}

async function addressFor(lat, lon) {
  const res = await nominatim('reverse', {
    lat: String(lat),
    lon: String(lon),
    zoom: '14',
    addressdetails: '1',
  })
  const a = res.address ?? {}
  const parts = [a.city ?? a.town ?? a.village ?? a.hamlet ?? a.county, a.state].filter(Boolean)
  return parts.length
    ? parts.join(', ')
    : (res.display_name ?? `${lat.toFixed(4)}, ${lon.toFixed(4)}`)
}

// ---------- Supabase ----------

function supabaseClient({ admin = false } = {}) {
  const env = readEnv()
  const url = env.VITE_SUPABASE_URL
  const key = admin ? env.SUPABASE_SERVICE_ROLE_KEY : env.VITE_SUPABASE_ANON_KEY
  if (!url || !key || key.includes('your-')) return null
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

async function publishedSourceIds() {
  const supabase = supabaseClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('viewpoints')
    .select('source_id')
    .not('source_id', 'is', null)
  return error ? [] : data.map((row) => row.source_id)
}

async function liveNearby(lat, lon) {
  const supabase = supabaseClient()
  if (!supabase) return { checked: false, nearby: [] }
  const { data, error } = await supabase.rpc('viewpoints_within_radius', {
    center_lat: lat,
    center_lng: lon,
    radius_miles: DUPLICATE_RADIUS_MILES,
  })
  if (error) return { checked: false, nearby: [] }
  return {
    checked: true,
    nearby: data.map((v) => ({ id: v.id, name: v.name, source_id: v.source_id ?? null })),
  }
}

// ---------- commands ----------

async function stage(json) {
  let input
  try {
    input = JSON.parse(json)
  } catch {
    fail('--json must be valid JSON')
  }
  const name = String(input.name ?? '').trim()
  const description = String(input.description ?? '').trim()
  const lat = Number(input.lat)
  const lon = Number(input.lon)
  if (name.length < 3 || name.length > 100) fail('name must be 3–100 characters')
  if (description.length < 40 || description.length > 600)
    fail('description must be 40–600 characters (write it in your own words)')
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) fail('lat and lon must be numbers')
  const region = regionFor(lat, lon)
  if (!region) fail('coordinates are outside every configured region')

  const qid = input.qid ? String(input.qid).trim() : null
  if (qid && !/^Q\d+$/.test(qid)) fail('qid must look like Q123')

  const staging = loadStaging()
  const warnings = []
  if (qid && staging.some((e) => e.source_id === qid && e.status !== 'rejected'))
    fail(`${qid} is already staged`)
  for (const e of staging) {
    if (e.status === 'rejected') continue
    const d = milesBetween(lat, lon, e.lat, e.lon)
    if (d <= DUPLICATE_RADIUS_MILES)
      warnings.push(`within ${DUPLICATE_RADIUS_MILES} mi of staged "${e.name}" (${e.id})`)
  }
  const live = await liveNearby(lat, lon)
  if (qid && live.nearby.some((v) => v.source_id === qid))
    fail(`${qid} is already published in IKAS`)
  for (const v of live.nearby)
    warnings.push(`within ${DUPLICATE_RADIUS_MILES} mi of live viewpoint "${v.name}"`)
  if (!live.checked) warnings.push('could not check the live database for duplicates')

  let photo = null
  if (input.photo) {
    photo = await checkCommonsFile(String(input.photo))
    if (!photo.ok)
      fail(
        `photo rejected: ${photo.reason} (${photo.title}). Pick another photo or stage with "photo": null.`,
      )
  }

  const tags = Array.isArray(input.tags)
    ? [...new Set(input.tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean))].slice(
        0,
        5,
      )
    : []
  const entry = {
    id: `c${randomBytes(3).toString('hex')}`,
    status: 'staged',
    staged_at: new Date().toISOString(),
    name,
    description,
    address: input.address ? String(input.address).trim() : await addressFor(lat, lon),
    lat,
    lon,
    region,
    tags,
    source: qid ? 'wikidata' : 'web',
    source_id: qid,
    source_url: qid ? `https://www.wikidata.org/wiki/${qid}` : (input.source_url ?? null),
    photo,
    warnings,
  }
  staging.push(entry)
  saveStaging(staging)
  return entry
}

function list(status = 'staged') {
  const entries = loadStaging().filter((e) => status === 'all' || e.status === status)
  return entries.map((e) => ({
    id: e.id,
    status: e.status,
    name: e.name,
    address: e.address,
    description: e.description,
    tags: e.tags,
    photo: e.photo ? `${e.photo.page_url} — ${e.photo.author} · ${e.photo.license}` : 'no photo',
    photo_preview: e.photo?.thumb_url ?? null,
    warnings: e.warnings,
    ...(e.viewpoint_id ? { viewpoint_id: e.viewpoint_id } : {}),
    ...(e.reject_reason ? { reject_reason: e.reject_reason } : {}),
  }))
}

function setStatus(ids, from, to, extra = {}) {
  if (!ids.length) fail('give at least one id')
  const staging = loadStaging()
  const changed = []
  for (const id of ids) {
    const e = staging.find((x) => x.id === id)
    if (!e) fail(`no staged entry ${id}`)
    if (!from.includes(e.status)) fail(`${id} is ${e.status}; expected ${from.join(' or ')}`)
    Object.assign(e, { status: to, [`${to}_at`]: new Date().toISOString(), ...extra })
    changed.push({ id, name: e.name, status: to })
  }
  saveStaging(staging)
  return changed
}

async function setup() {
  const supabase = supabaseClient({ admin: true })
  if (!supabase) fail('SUPABASE_SERVICE_ROLE_KEY and VITE_SUPABASE_URL must be set in .env')
  const config = loadJson(CONFIG_PATH, {})
  if (config.curator_user_id) return { curator_user_id: config.curator_user_id, created: false }
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'curator@ikas-curator.invalid',
    password: randomBytes(24).toString('base64url'),
    email_confirm: true,
    user_metadata: { full_name: 'IKAS Curator' },
  })
  if (error) fail(`could not create curator account: ${error.message}`)
  saveJson(CONFIG_PATH, { ...config, curator_user_id: data.user.id })
  return { curator_user_id: data.user.id, created: true }
}

/** Remove an uploaded image; returns '' on success or a note naming the orphaned path. */
async function removeUpload(supabase, path) {
  if (!path) return ''
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  return error ? `; orphaned upload ${BUCKET}/${path} (${error.message})` : ''
}

/** Attach tags to a viewpoint; returns an error message or null. */
async function linkTags(supabase, viewpointId, names) {
  if (!names.length) return null
  const { error: upsertError } = await supabase.from('tags').upsert(
    names.map((name) => ({ name })),
    { onConflict: 'name', ignoreDuplicates: true },
  )
  if (upsertError) return upsertError.message
  const { data: tagRows, error: selectError } = await supabase
    .from('tags')
    .select('id')
    .in('name', names)
  if (selectError) return selectError.message
  const { error: linkError } = await supabase
    .from('viewpoint_tags')
    .insert(tagRows.map((t) => ({ viewpoint_id: viewpointId, tag_id: t.id })))
  return linkError ? linkError.message : null
}

async function publish(dryRun) {
  const staging = loadStaging()
  const approved = staging.filter((e) => e.status === 'approved')
  if (!approved.length) return { published: [], note: 'nothing approved' }
  const supabase = dryRun ? null : supabaseClient({ admin: true })
  if (!dryRun && !supabase)
    fail('SUPABASE_SERVICE_ROLE_KEY and VITE_SUPABASE_URL must be set in .env')
  const curatorId = loadJson(CONFIG_PATH, {}).curator_user_id
  if (!dryRun && !curatorId) fail('run "setup" first to create the curator account')

  const results = []
  for (const e of approved) {
    let photo = null
    if (e.photo) {
      photo = await checkCommonsFile(e.photo.title) // licenses can change: verify again at publish time
      if (!photo.ok) {
        results.push({
          id: e.id,
          name: e.name,
          published: false,
          reason: `photo no longer allowed: ${photo.reason}`,
        })
        continue
      }
    }
    if (dryRun) {
      results.push({
        id: e.id,
        name: e.name,
        would_publish: true,
        photo: photo ? `${photo.author} · ${photo.license}` : null,
      })
      continue
    }

    let imageUrl = null
    let path = null
    if (photo) {
      const res = await fetch(photo.thumb_url, { headers: { 'User-Agent': UA } })
      if (!res.ok) {
        results.push({
          id: e.id,
          name: e.name,
          published: false,
          reason: `photo download failed (${res.status})`,
        })
        continue
      }
      const contentType = res.headers.get('content-type') ?? 'image/jpeg'
      const ext = contentType.includes('png')
        ? 'png'
        : contentType.includes('webp')
          ? 'webp'
          : 'jpg'
      path = `${curatorId}/curated-${e.source_id ?? e.id}-${randomBytes(3).toString('hex')}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, Buffer.from(await res.arrayBuffer()), { contentType, upsert: false })
      if (uploadError) {
        results.push({
          id: e.id,
          name: e.name,
          published: false,
          reason: `upload failed: ${uploadError.message}`,
        })
        continue
      }
      imageUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
    }

    const { data: row, error: insertError } = await supabase
      .from('viewpoints')
      .insert({
        created_by: curatorId,
        name: e.name,
        description: e.description,
        address: e.address,
        latitude: e.lat,
        longitude: e.lon,
        image_url: imageUrl,
        image_author: photo?.author ?? null,
        image_license: photo?.license ?? null,
        image_license_url: photo?.license_url ?? null,
        image_source_url: photo?.page_url ?? null,
        source: e.source,
        source_id: e.source_id,
      })
      .select('id')
      .single()
    if (insertError) {
      const cleanup = await removeUpload(supabase, path)
      results.push({
        id: e.id,
        name: e.name,
        published: false,
        reason: `insert failed: ${insertError.message}${cleanup}`,
      })
      continue
    }

    const tagError = await linkTags(supabase, row.id, e.tags)
    if (tagError) {
      // Mirror createViewpoint: roll back the row (viewpoint_tags cascade) and its image.
      const { error: deleteError } = await supabase.from('viewpoints').delete().eq('id', row.id)
      const cleanup = await removeUpload(supabase, path)
      results.push({
        id: e.id,
        name: e.name,
        published: false,
        reason: `tagging failed: ${tagError}${deleteError ? `; could not roll back viewpoint ${row.id}: ${deleteError.message}` : ''}${cleanup}`,
      })
      continue
    }

    Object.assign(e, {
      status: 'published',
      published_at: new Date().toISOString(),
      viewpoint_id: row.id,
    })
    saveStaging(staging)
    results.push({ id: e.id, name: e.name, published: true, viewpoint_id: row.id })
  }
  return { dry_run: dryRun, published: results }
}

async function main() {
  const [command, ...rest] = process.argv.slice(2)
  const { positional, flags } = parseArgs(rest)
  switch (command) {
    case 'discover':
      return out(
        await discover({
          region: flags.region,
          types: flags.types,
          limit: flags.limit ?? 15,
          photoOnly: Boolean(flags['photo-only']),
        }),
      )
    case 'lookup':
      if (!positional[0]) fail('usage: lookup "<place name>"')
      return out(await lookup(positional.join(' ')))
    case 'photos':
      if (flags.file) return out(await checkCommonsFile(String(flags.file)))
      if (flags.lat === undefined || flags.lon === undefined)
        fail('usage: photos --lat <n> --lon <n> [--radius m] | --file "File:…"')
      return out(await photosNear(Number(flags.lat), Number(flags.lon), flags.radius, flags.limit))
    case 'stage':
      if (!flags.json) fail("usage: stage --json '{…}'")
      return out(await stage(String(flags.json)))
    case 'list':
      return out(list(flags.status ?? 'staged'))
    case 'approve':
      return out(setStatus(positional, ['staged', 'rejected'], 'approved'))
    case 'reject':
      return out(
        setStatus(positional, ['staged', 'approved'], 'rejected', {
          reject_reason: flags.reason ?? null,
        }),
      )
    case 'setup':
      return out(await setup())
    case 'publish':
      return out(await publish(Boolean(flags['dry-run'])))
    default:
      console.log(readFileSync(new URL(import.meta.url), 'utf8').split('*/')[0])
      process.exit(command ? 1 : 0)
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => fail(error.message))
}
