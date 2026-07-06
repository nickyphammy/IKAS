const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org'
const USER_AGENT = 'IKAS/1.0 (viewpoint discovery app)'

interface NominatimAddress {
  house_number?: string
  road?: string
  neighbourhood?: string
  suburb?: string
  city?: string
  town?: string
  village?: string
  county?: string
  state?: string
  postcode?: string
  country?: string
  tourism?: string
  natural?: string
  peak?: string
  park?: string
  historic?: string
  amenity?: string
}

interface NominatimResult {
  place_id: number
  display_name: string
  name?: string
  type?: string
  address?: NominatimAddress
}

export interface AddressSuggestion {
  id: string
  label: string
}

function nominatimHeaders(): HeadersInit {
  return {
    'User-Agent': USER_AGENT,
    'Accept-Language': 'en',
  }
}

function roadLine(address: NominatimAddress): string | undefined {
  if (address.road) {
    return address.house_number ? `${address.house_number} ${address.road}` : address.road
  }
  return undefined
}

function locality(address: NominatimAddress): string | undefined {
  return address.city ?? address.town ?? address.village ?? address.county
}

function placeName(address: NominatimAddress): string | undefined {
  return (
    address.tourism ??
    address.natural ??
    address.peak ??
    address.park ??
    address.historic ??
    address.amenity
  )
}

function formatStreetAddress(address: NominatimAddress): string | undefined {
  const parts = [roadLine(address), locality(address), address.state, address.postcode].filter(
    Boolean,
  )
  return parts.length ? parts.join(', ') : undefined
}

function formatPlaceAddress(address: NominatimAddress): string | undefined {
  const named = placeName(address)
  if (!named) return undefined
  const parts = [named, locality(address), address.state].filter(Boolean)
  return parts.join(', ')
}

function formatAreaAddress(address: NominatimAddress): string | undefined {
  const parts = [
    address.neighbourhood ?? address.suburb,
    locality(address),
    address.state,
  ].filter(Boolean)
  return parts.length ? parts.join(', ') : undefined
}

function suggestionsFromResult(result: NominatimResult): AddressSuggestion[] {
  const seen = new Set<string>()
  const suggestions: AddressSuggestion[] = []

  function add(label: string | undefined, idSuffix: string) {
    const trimmed = label?.trim()
    if (!trimmed) return
    const key = trimmed.toLowerCase()
    if (seen.has(key)) return
    seen.add(key)
    suggestions.push({ id: `${result.place_id}-${idSuffix}`, label: trimmed })
  }

  if (result.address) {
    add(formatStreetAddress(result.address), 'street')
    add(formatPlaceAddress(result.address), 'place')
    add(formatAreaAddress(result.address), 'area')
  }

  if (result.name) {
    add(
      [result.name, result.address ? locality(result.address) : undefined, result.address?.state]
        .filter(Boolean)
        .join(', '),
      'name',
    )
  }

  add(result.display_name, 'full')

  return suggestions
}

async function fetchReverse(lat: number, lng: number, signal?: AbortSignal): Promise<NominatimResult | null> {
  const url = new URL(`${NOMINATIM_BASE}/reverse`)
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('lat', String(lat))
  url.searchParams.set('lon', String(lng))
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('namedetails', '1')
  url.searchParams.set('zoom', '18')

  const res = await fetch(url, { headers: nominatimHeaders(), signal })
  if (!res.ok) return null

  const data = (await res.json()) as NominatimResult & { error?: string }
  if (data.error || !data.display_name) return null
  return data
}

async function fetchNearby(lat: number, lng: number, signal?: AbortSignal): Promise<NominatimResult[]> {
  const pad = 0.004
  const url = new URL(`${NOMINATIM_BASE}/search`)
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('limit', '5')
  url.searchParams.set('viewbox', `${lng - pad},${lat + pad},${lng + pad},${lat - pad}`)
  url.searchParams.set('bounded', '1')
  url.searchParams.set('layer', 'address')

  const res = await fetch(url, { headers: nominatimHeaders(), signal })
  if (!res.ok) return []

  const data = (await res.json()) as NominatimResult[]
  return Array.isArray(data) ? data : []
}

export async function fetchAddressSuggestions(
  lat: number,
  lng: number,
  signal?: AbortSignal,
): Promise<AddressSuggestion[]> {
  const [reverse, nearby] = await Promise.all([
    fetchReverse(lat, lng, signal),
    fetchNearby(lat, lng, signal),
  ])

  const merged: AddressSuggestion[] = []
  const seen = new Set<string>()

  function addAll(results: NominatimResult[]) {
    for (const result of results) {
      for (const suggestion of suggestionsFromResult(result)) {
        const key = suggestion.label.toLowerCase()
        if (seen.has(key)) continue
        seen.add(key)
        merged.push(suggestion)
      }
    }
  }

  if (reverse) addAll([reverse])
  addAll(nearby)

  return merged.slice(0, 6)
}
