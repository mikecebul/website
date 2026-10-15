import { createFileRoute, notFound } from '@tanstack/react-router'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { MarketingJournalArticle } from '@/components/marketing/journal-article'
import { createMarketingHead } from '@/lib/marketing-metadata'
import { getBlogPost } from '@/server/blog.functions'
import type { Blog } from '@/payload-types'
import { getBlogImages, getBlogPostDescription, getBlogFeaturedImage } from '@/lib/blog-seo'
import { JsonLd, createBlogPostingJsonLd } from '@/components/seo/json-ld'

export const Route = createFileRoute('/_marketing/blog/$slug')({
  loader: async ({ params }) => {
    const result = await getBlogPost({ data: { slug: params.slug } })
    if (!result.post) throw notFound()
    return result
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post
      ? ({ ...loaderData.post, content: JSON.parse(loaderData.post.content) } as Blog)
      : null
    const image = getBlogFeaturedImage(post) ?? getBlogImages(post?.content?.root)[0]
    const head = createMarketingHead({
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
      image: image?.url
        ? {
            url: image.url,
            alt: image.alt,
            width: image.width ?? undefined,
            height: image.height ?? undefined,
          }
        : undefined,
      noindex: loaderData?.draft || !post,
      publishedAt: post?.firstPublishedAt,
      modifiedAt: post?.updatedAt,
      pathname: `/blog/${loaderData?.post?.slug ?? ''}`,
    })
    return head
  },
  component: BlogPostPage,
})
function BlogPostPage() {
  const { post, draft, relatedPosts } = Route.useLoaderData()
  if (!post) return null
  const parsedPost = { ...post, content: JSON.parse(post.content) } as Blog
  return (
    <>
      {!draft ? <JsonLd data={createBlogPostingJsonLd(parsedPost)} /> : null}
      {draft ? <LivePreviewListener /> : null}
      <MarketingJournalArticle post={parsedPost} draft={draft} relatedPosts={relatedPosts} />
    </>
  )
}
