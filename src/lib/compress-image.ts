const DEFAULT_MAX_DIMENSION = 1600
const DEFAULT_QUALITY = 0.82
const SKIP_BELOW_BYTES = 200_000

export interface CompressImageResult {
  file: File
  originalSize: number
  compressedSize: number
  wasCompressed: boolean
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }
    img.src = url
  })
}

function scaleDimensions(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } {
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height }
  }
  const ratio = Math.min(maxWidth / width, maxHeight / height)
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  }
}

export async function compressImageForUpload(
  file: File,
  options?: { maxDimension?: number; quality?: number },
): Promise<CompressImageResult> {
  const originalSize = file.size

  if (!file.type.startsWith('image/')) {
    return { file, originalSize, compressedSize: originalSize, wasCompressed: false }
  }

  const maxDimension = options?.maxDimension ?? DEFAULT_MAX_DIMENSION
  const quality = options?.quality ?? DEFAULT_QUALITY

  const img = await loadImage(file)
  const needsResize = img.width > maxDimension || img.height > maxDimension
  const isSmallJpeg = file.type === 'image/jpeg' && file.size <= SKIP_BELOW_BYTES

  if (!needsResize && isSmallJpeg) {
    return { file, originalSize, compressedSize: originalSize, wasCompressed: false }
  }

  const { width, height } = scaleDimensions(img.width, img.height, maxDimension, maxDimension)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return { file, originalSize, compressedSize: originalSize, wasCompressed: false }
  }

  ctx.drawImage(img, 0, 0, width, height)

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', quality)
  })

  if (!blob) {
    return { file, originalSize, compressedSize: originalSize, wasCompressed: false }
  }

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'viewpoint'
  const compressed = new File([blob], `${baseName}.jpg`, {
    type: 'image/jpeg',
    lastModified: Date.now(),
  })

  return {
    file: compressed,
    originalSize,
    compressedSize: compressed.size,
    wasCompressed: true,
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
