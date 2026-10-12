import { createFileRoute, notFound } from '@tanstack/react-router'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { RichText } from '@/components/RichText'
import { createMarketingHead } from '@/lib/marketing-metadata'
import { formatDateTime } from '@/lib/formatDateTime'
import Link from '@/components/router-link'
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
  const publishedAt = post.firstPublishedAt || post.createdAt

  return (
    <main className="pt-8 pb-24 sm:pt-10 lg:pt-14 lg:pb-32">
      {draft ? <LivePreviewListener /> : null}

      <section className="mx-auto max-w-[1220px] px-4 pt-6 sm:px-6 lg:px-12">
        <Link
          className="text-sm text-(--marketing-copy) transition-colors hover:text-(--marketing-gold)"
          href="/blog"
        >
          Back to blog
        </Link>

        {publishedAt ? (
          <p className="pt-6 text-sm uppercase tracking-[0.28em] text-(--marketing-sky)">
            {formatDateTime(publishedAt)}
          </p>
        ) : null}

        <h1 className="mt-3 max-w-4xl font-heading text-5xl leading-[0.94] tracking-[-0.07em] text-(--marketing-heading) sm:text-6xl">
          {post.title}
        </h1>
      </section>

      <article className="mx-auto mt-16 max-w-[860px] rounded-[34px] border border-white/8 bg-[rgba(19,27,46,0.82)] px-6 py-8 shadow-[0_26px_70px_rgba(0,0,0,0.28)] sm:px-10 sm:py-10">
        {post.content ? (
          <RichText
            className="marketing-richtext"
            data={JSON.parse(post.content)}
            enableGutter={false}
          />
        ) : null}
      </article>
    </main>
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
