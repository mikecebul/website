import type { Blog } from '@/payload-types'
import { collectLexicalText } from './blog-seo'

export const getBlogTopicLabel = (topic?: Blog['topic']) =>
  ({ websites: 'Websites', 'ai-workflows': 'AI workflows', 'hybrid-meetings': 'Hybrid meetings' })[
    topic || ''
  ] || 'From the journal'

export function getBlogReadingTime(content: Blog['content'] | undefined): number {
  const words = collectLexicalText(content?.root).join(' ').match(/\S+/g)?.length || 0
  return Math.max(1, Math.ceil(words / 200))
}

export function getBlogSummary(post: Pick<Blog, 'summary' | 'content'>): string {
  if (post.summary?.trim()) return post.summary.trim()
  const paragraph = post.content?.root?.children.find((node) => node.type === 'paragraph')
  const text = collectLexicalText(paragraph).join(' ').replace(/\s+/g, ' ').trim()
  if (text.length <= 200) return text
  const excerpt = text.slice(0, 199)
  const lastSpace = excerpt.lastIndexOf(' ')
  return `${excerpt.slice(0, lastSpace > 0 ? lastSpace : undefined).trimEnd()}…`
}

export const formatBlogDate = (timestamp: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/Detroit',
  }).format(new Date(timestamp))

export type JournalPost = Pick<
  Blog,
  'id' | 'title' | 'slug' | 'featuredImage' | 'topic' | 'firstPublishedAt' | 'createdAt'
> & {
  description: string
  readingTime: number
}

export function toJournalPost(
  post: Omit<JournalPost, 'description' | 'readingTime'> & Pick<Blog, 'content' | 'summary'>,
): JournalPost {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    featuredImage: post.featuredImage,
    topic: post.topic,
    firstPublishedAt: post.firstPublishedAt,
    createdAt: post.createdAt,
    description: getBlogSummary(post),
    readingTime: getBlogReadingTime(post.content),
  }
}
