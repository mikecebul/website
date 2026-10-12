import { createFileRoute, notFound } from '@tanstack/react-router'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { MarketingJournalArticle } from '@/components/marketing/journal-article'
import { createMarketingHead } from '@/lib/marketing-metadata'
import { getBlogPost } from '@/server/blog.functions'
import type { Blog } from '@/payload-types'

export const Route = createFileRoute('/_marketing/blog/$slug')({
  loader: async ({ params }) => {
    const result = await getBlogPost({ data: { slug: params.slug } })
    if (!result.post) throw notFound()
    return result
  },
  head: ({ loaderData }) =>
    createMarketingHead({
      title: loaderData?.post ? `${loaderData.post.title} | MIKECEBUL` : 'Blog | MIKECEBUL',
      description: getBlogPostDescription(
        loaderData?.post
          ? { ...loaderData.post, content: JSON.parse(loaderData.post.content) }
          : null,
      ),
      keywords: [
        loaderData?.post?.title ?? 'Blog',
        'technical consulting blog',
        'small business automation',
        'Mike Cebulski',
      ],
      ogType: 'article',
      pathname: `/blog/${loaderData?.post?.slug ?? ''}`,
    }),
  component: BlogPostPage,
})
function BlogPostPage() {
  const { post, draft } = Route.useLoaderData()
  if (!post) return null
  return (
    <>
      {draft ? <LivePreviewListener /> : null}
      <MarketingJournalArticle post={{ ...post, content: JSON.parse(post.content) }} />
    </>
  )
}

const collectLexicalText = (node: unknown): string[] => {
  if (!node || typeof node !== 'object') {
    return []
  }

  const segments: string[] = []

  if ('text' in node && typeof node.text === 'string') {
    const trimmedText = node.text.trim()

    if (trimmedText) {
      segments.push(trimmedText)
    }
  }

  if ('children' in node && Array.isArray(node.children)) {
    for (const child of node.children) {
      segments.push(...collectLexicalText(child))
    }
  }

  return segments
}

const getBlogPostDescription = (post: Blog | null) => {
  if (!post) {
    return 'Read the latest article from Mike Cebulski.'
  }

  const contentText = collectLexicalText(post.content?.root).join(' ').replace(/\s+/g, ' ').trim()

  if (!contentText) {
    return `Read ${post.title} on the MIKECEBUL blog.`
  }

  const maxLength = 160
  if (contentText.length <= maxLength) {
    return contentText
  }

  return `${contentText.slice(0, maxLength - 1).trimEnd()}…`
}
