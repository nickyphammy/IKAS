import { useEffect, useState } from 'react'
import { fetchAddressSuggestions, type AddressSuggestion } from '@/lib/reverse-geocode'

export function useAddressSuggestions(latitude: number | null, longitude: number | null) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (latitude == null || longitude == null) {
      setSuggestions([])
      setLoading(false)
      setError(null)
      return
    }

    const controller = new AbortController()
    const timer = setTimeout(() => {
      setLoading(true)
      setError(null)

      fetchAddressSuggestions(latitude, longitude, controller.signal)
        .then((results) => {
          if (controller.signal.aborted) return
          setSuggestions(results)
          if (!results.length) {
            setError('No address found for this location — enter one manually')
          }
        })
        .catch((err: unknown) => {
          if (controller.signal.aborted) return
          setSuggestions([])
          setError(err instanceof Error ? err.message : 'Could not look up address')
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false)
        })
    }, 400)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [latitude, longitude])

  return { suggestions, loading, error }
}
