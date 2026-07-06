import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, MapPin, X, Upload } from 'lucide-react'
import { LocationPickerMap } from '@/components/map/LocationPickerMap'
import { PageContainer } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { StarRatingInput } from '@/components/ui/rating'
import { useAddressSuggestions } from '@/hooks/use-address-suggestions'
import { useCreateViewpoint } from '@/hooks/use-viewpoints'
import { compressImageForUpload, formatFileSize } from '@/lib/compress-image'
import { cn } from '@/lib/utils'

export default function AddViewpointPage() {
  const navigate = useNavigate()
  const createViewpoint = useCreateViewpoint()

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [rating, setRating] = useState(4)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageCompressNote, setImageCompressNote] = useState<string | null>(null)
  const [imageCompressing, setImageCompressing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    suggestions: addressSuggestions,
    loading: addressLoading,
    error: addressLookupError,
  } = useAddressSuggestions(latitude, longitude)

  useEffect(() => {
    if (latitude == null || longitude == null || addressLoading || !addressSuggestions.length) {
      return
    }
    setAddress(addressSuggestions[0].label)
  }, [latitude, longitude, addressLoading, addressSuggestions])

  async function handleImageSelect(file: File | null) {
    if (!file) {
      setImageFile(null)
      setImageCompressNote(null)
      return
    }

    setImageCompressing(true)
    setImageCompressNote(null)
    try {
      const result = await compressImageForUpload(file)
      setImageFile(result.file)
      if (result.wasCompressed) {
        setImageCompressNote(
          `Optimized ${formatFileSize(result.originalSize)} → ${formatFileSize(result.compressedSize)}`,
        )
      } else {
        setImageCompressNote(`Ready to upload (${formatFileSize(result.compressedSize)})`)
      }
    } catch {
      setError('Could not process image. Try a different file.')
      setImageFile(null)
      setImageCompressNote(null)
    } finally {
      setImageCompressing(false)
    }
  }

  function handleLocationChange(lat: number, lng: number) {
    setLatitude(lat)
    setLongitude(lng)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (latitude == null || longitude == null) {
      setError('Please pin a location on the map')
      return
    }

    try {
      const vp = await createViewpoint.mutateAsync({
        name,
        address,
        latitude,
        longitude,
        description,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        initial_rating: rating,
        imageFile,
      })
      navigate(`/viewpoint/${vp.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create viewpoint')
    }
  }

  return (
    <PageContainer className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Add a viewpoint</h1>
          <p className="text-sm text-muted">Share a scenic spot with the community</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => navigate('/home')} aria-label="Close">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Photo</label>
          <label
            className={cn(
              'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-white px-6 py-10 transition hover:border-brand hover:bg-brand-light/30',
              imageCompressing && 'pointer-events-none opacity-60',
            )}
          >
            {imageCompressing ? (
              <Loader2 className="mb-2 h-8 w-8 animate-spin text-brand" />
            ) : (
              <Upload className="mb-2 h-8 w-8 text-muted" />
            )}
            <span className="text-sm text-muted">
              {imageCompressing
                ? 'Optimizing image…'
                : imageFile
                  ? imageFile.name
                  : 'Click to upload an image'}
            </span>
            {imageCompressNote && (
              <span className="mt-1 text-xs text-brand">{imageCompressNote}</span>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={imageCompressing}
              onChange={(e) => void handleImageSelect(e.target.files?.[0] ?? null)}
            />
          </label>
          <p className="mt-1.5 text-xs text-muted">
            Images are resized to 1600px max and compressed as JPEG to save storage.
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Location on map *</label>
          <LocationPickerMap
            latitude={latitude}
            longitude={longitude}
            onLocationChange={handleLocationChange}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Address *</label>
          <div className="relative">
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder={
                latitude != null && longitude != null
                  ? 'Looking up address…'
                  : 'Pin a location on the map first'
              }
              disabled={latitude == null || longitude == null}
            />
            {addressLoading && (
              <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted" />
            )}
          </div>
          {latitude != null && longitude != null && (
            <p className="mt-1.5 text-xs text-muted">
              {addressLoading
                ? 'Finding address for pinned location…'
                : 'Address autofills from the map pin — pick another suggestion or edit manually'}
            </p>
          )}
          {addressLookupError && !addressLoading && (
            <p className="mt-1.5 text-xs text-amber-700">{addressLookupError}</p>
          )}
          {addressSuggestions.length > 1 && !addressLoading && (
            <ul className="mt-2 space-y-1 rounded-xl border border-border bg-white p-2">
              {addressSuggestions.map((suggestion) => (
                <li key={suggestion.id}>
                  <button
                    type="button"
                    onClick={() => setAddress(suggestion.label)}
                    className={cn(
                      'flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-brand-light/40',
                      address === suggestion.label && 'bg-brand-light/60 font-medium text-brand',
                    )}
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                    <span>{suggestion.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Name *</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Sunset Ridge Lookout"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Description *</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="What makes this spot special?"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Tags</label>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Ocean View, Photography (comma separated)"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Your rating</label>
          <StarRatingInput value={rating} onChange={setRating} />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <Button type="submit" className="w-full" disabled={createViewpoint.isPending}>
          {createViewpoint.isPending ? 'Submitting…' : 'Share viewpoint'}
        </Button>
      </form>
    </PageContainer>
  )
}
