import type { RichTextBlock, Media } from '@/payload-types'

export type SanitizedImage = {
  image: Media
  id: string
}

export const imagesAsMedia = (images: RichTextBlock['images']): Media[] => {
  const isMediaObject = (item: unknown): item is Media => {
    if (typeof item !== 'object' || item === null) return false

    if (!('url' in item) && !('filename' in item)) return false

    const media = item as Partial<Media>
    return typeof media.url === 'string' || typeof media.filename === 'string'
  }

  if (Array.isArray(images)) {
    return images.filter(isMediaObject)
  }

  return []
}
