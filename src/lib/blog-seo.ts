import type { Blog, Media } from '@/payload-types'

export function collectLexicalText(node: unknown): string[] {
  if (!node || typeof node !== 'object') return []
  const text = 'text' in node && typeof node.text === 'string' ? [node.text.trim()] : []
  const children = 'children' in node && Array.isArray(node.children) ? node.children : []
  return [...text, ...children.flatMap(collectLexicalText)].filter(Boolean)
}

export function getBlogPostDescription(
  post: (Pick<Blog, 'title' | 'content'> & Partial<Pick<Blog, 'summary'>>) | null,
) {
  if (!post) return 'Read the latest article from Mike Cebulski.'
  const text = (post.summary?.trim() || collectLexicalText(post.content?.root).join(' '))
    .replace(/\s+/g, ' ')
    .trim()
  if (!text) return `Read ${post.title} on the Mike Cebulski blog.`
  if (text.length <= 160) return text
  const excerpt = text.slice(0, 159)
  return `${excerpt.slice(0, excerpt.lastIndexOf(' ')).trimEnd()}…`
}

export function getBlogImages(node: unknown): Media[] {
  if (!node || typeof node !== 'object') return []
  const images: Media[] = []
  if ('fields' in node && node.fields && typeof node.fields === 'object') {
    const fields = node.fields
    if (
      'blockType' in fields &&
      fields.blockType === 'mediaBlock' &&
      'media' in fields &&
      fields.media &&
      typeof fields.media === 'object' &&
      'url' in fields.media &&
      typeof fields.media.url === 'string'
    ) {
      images.push(fields.media as Media)
    }
  }
  if ('children' in node && Array.isArray(node.children))
    images.push(...node.children.flatMap(getBlogImages))
  return images
}

export function getBlogFeaturedImage(post: Pick<Blog, 'featuredImage'> | null): Media | null {
  const image = post?.featuredImage
  return image && typeof image === 'object' && image.url ? image : null
}
