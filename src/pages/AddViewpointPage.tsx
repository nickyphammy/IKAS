import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Upload } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { StarRatingInput } from '@/components/ui/rating'
import { useCreateViewpoint } from '@/hooks/use-viewpoints'
import { BEST_TIME_OPTIONS, DIFFICULTY_OPTIONS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export default function AddViewpointPage() {
  const navigate = useNavigate()
  const createViewpoint = useCreateViewpoint()

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [description, setDescription] = useState('')
  const [bestTime, setBestTime] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [estimatedVisit, setEstimatedVisit] = useState('')
  const [tags, setTags] = useState('')
  const [rating, setRating] = useState(4)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setError('Please enter valid latitude and longitude')
      return
    }

    try {
      const vp = await createViewpoint.mutateAsync({
        name,
        address,
        latitude: lat,
        longitude: lng,
        description,
        best_time: bestTime || undefined,
        difficulty: difficulty || undefined,
        estimated_visit: estimatedVisit || undefined,
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
          <label className="mb-1.5 block text-sm font-medium">Name *</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Sunset Ridge Lookout" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Address *</label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="123 Trail Rd, City, State" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Latitude *</label>
            <Input value={latitude} onChange={(e) => setLatitude(e.target.value)} required placeholder="33.5427" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Longitude *</label>
            <Input value={longitude} onChange={(e) => setLongitude(e.target.value)} required placeholder="-117.7854" />
          </div>
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Best time</label>
            <select
              value={bestTime}
              onChange={(e) => setBestTime(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-border bg-white px-4 text-sm"
            >
              <option value="">Select…</option>
              {BEST_TIME_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-border bg-white px-4 text-sm"
            >
              <option value="">Select…</option>
              {DIFFICULTY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Estimated visit</label>
          <Input value={estimatedVisit} onChange={(e) => setEstimatedVisit(e.target.value)} placeholder="30–45 minutes" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Tags</label>
          <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Ocean View, Photography (comma separated)" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Your rating</label>
          <StarRatingInput value={rating} onChange={setRating} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Photo</label>
          <label
            className={cn(
              'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-white px-6 py-10 transition hover:border-brand hover:bg-brand-light/30',
            )}
          >
            <Upload className="mb-2 h-8 w-8 text-muted" />
            <span className="text-sm text-muted">
              {imageFile ? imageFile.name : 'Click to upload an image'}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
          </label>
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
