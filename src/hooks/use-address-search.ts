import { useEffect, useState } from 'react'
import { searchAddresses, type AddressSearchResult } from '@/lib/reverse-geocode'

export function useAddressSearch(query: string, enabled: boolean) {
  const [results, setResults] = useState<AddressSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const trimmed = query.trim()
    if (!enabled || trimmed.length < 3) {
      setResults([])
      setLoading(false)
      setError(null)
      return
    }

    const controller = new AbortController()
    const timer = setTimeout(() => {
      setLoading(true)
      setError(null)

      searchAddresses(trimmed, controller.signal)
        .then((next) => {
          if (controller.signal.aborted) return
          setResults(next)
          if (!next.length) {
            setError('No locations found — try a different search')
          }
        })
        .catch((err: unknown) => {
          if (controller.signal.aborted) return
          setResults([])
          setError(err instanceof Error ? err.message : 'Address search failed')
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false)
        })
    }, 350)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query, enabled])

  return { results, loading, error }
}
