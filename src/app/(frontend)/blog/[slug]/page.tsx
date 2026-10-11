import configPromise from '@payload-config'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { MarketingJournalArticle } from '@/components/marketing/journal-article'
import { createMarketingMetadata } from '@/lib/marketing-metadata'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { getPayload } from 'payload'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'blogs',
    draft: false,
    limit: 1000,
    overrideAccess: true,
    pagination: false,
    where: {
      _status: {
        equals: 'published',
      },
    },
    select: {
      slug: true,
    },
  })

  return docs
    .filter((doc) => Boolean(doc.slug))
    .map((doc) => ({
      slug: doc.slug as string,
    }))
}

type Args = {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogPostPage({ params }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params

  const post = await queryBlogBySlug({ slug })

  if (!post) {
    notFound()
  }

  return (
    <>
      {draft ? <LivePreviewListener /> : null}
      <MarketingJournalArticle post={post} />
    </>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const post = await queryBlogBySlug({ slug })

  if (!post) {
    return {
      title: 'Blog | MIKECEBUL',
    }
  }

  const title = `${post.title} | MIKECEBUL`
  const description = getBlogPostDescription(post)

  return createMarketingMetadata({
    description,
    keywords: [
      post.title,
      ...new Set(['technical consulting blog', 'small business automation', 'Mike Cebulski']),
    ],
    ogType: 'article',
    pathname: `/blog/${post.slug}`,
    title,
  })
}

const queryBlogBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'blogs',
    depth: 1,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

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

const getBlogPostDescription = (post: Awaited<ReturnType<typeof queryBlogBySlug>>) => {
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
