import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createViewpoint,
  getDailyRecs,
  getRecommendedViewpoints,
  getSavedViewpoints,
  getUserRating,
  getViewpointById,
  getViewpoints,
  isViewpointSaved,
  toggleSavedViewpoint,
  uploadViewpointImage,
  upsertRating,
} from '@/services/viewpoints'
import type { CreateViewpointInput } from '@/types'
import { useAuth } from '@/app/auth-context'

export function useRecommendedViewpoints() {
  return useQuery({
    queryKey: ['viewpoints', 'recommended'],
    queryFn: () => getRecommendedViewpoints(),
  })
}

export function useViewpoints(filters?: {
  search?: string
  centerLat?: number
  centerLng?: number
  radiusMiles?: number
}) {
  return useQuery({
    queryKey: ['viewpoints', filters],
    queryFn: () => getViewpoints(filters),
  })
}

export function useViewpoint(id: string | undefined) {
  return useQuery({
    queryKey: ['viewpoint', id],
    queryFn: () => (id ? getViewpointById(id) : null),
    enabled: Boolean(id),
  })
}

export function useDailyRecs() {
  return useQuery({
    queryKey: ['viewpoints', 'daily-recs'],
    queryFn: () => getDailyRecs(),
  })
}

export function useSavedViewpoints() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['saved', user?.id],
    queryFn: () => (user ? getSavedViewpoints(user.id) : []),
    enabled: Boolean(user),
  })
}

export function useIsSaved(viewpointId: string | undefined) {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['saved', user?.id, viewpointId],
    queryFn: () =>
      user && viewpointId ? isViewpointSaved(user.id, viewpointId) : false,
    enabled: Boolean(user && viewpointId),
  })
}

export function useUserRating(viewpointId: string | undefined) {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['rating', user?.id, viewpointId],
    queryFn: () =>
      user && viewpointId ? getUserRating(viewpointId, user.id) : null,
    enabled: Boolean(user && viewpointId),
  })
}

export function useCreateViewpoint() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (input: CreateViewpointInput & { imageFile?: File | null }) => {
      if (!user) throw new Error('You must be signed in')
      let image_url = input.image_url
      if (input.imageFile) {
        image_url = await uploadViewpointImage(input.imageFile, user.id)
      }
      return createViewpoint({ ...input, image_url }, user.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['viewpoints'] })
    },
  })
}

export function useToggleSaved() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (viewpointId: string) => {
      if (!user) throw new Error('You must be signed in')
      return toggleSavedViewpoint(user.id, viewpointId)
    },
    onSuccess: (_saved, viewpointId) => {
      queryClient.invalidateQueries({ queryKey: ['saved'] })
      queryClient.invalidateQueries({ queryKey: ['saved', user?.id, viewpointId] })
    },
  })
}

export function useUpsertRating() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: ({ viewpointId, rating }: { viewpointId: string; rating: number }) => {
      if (!user) throw new Error('You must be signed in')
      return upsertRating(viewpointId, user.id, rating)
    },
    onSuccess: (_data, { viewpointId }) => {
      queryClient.invalidateQueries({ queryKey: ['viewpoint', viewpointId] })
      queryClient.invalidateQueries({ queryKey: ['viewpoints'] })
      queryClient.invalidateQueries({ queryKey: ['rating', user?.id, viewpointId] })
    },
  })
}

export function useGeolocation() {
  return useQuery({
    queryKey: ['geolocation'],
    queryFn: () =>
      new Promise<{ lat: number; lng: number }>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation not supported'))
          return
        }
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          (err) => reject(err),
          { enableHighAccuracy: false, timeout: 10000 },
        )
      }),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}
