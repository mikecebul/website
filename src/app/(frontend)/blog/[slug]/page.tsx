import configPromise from '@payload-config'
import Container from '@/components/Container'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { RichText } from '@/components/RichText'
import { baseUrl } from '@/utilities/baseUrl'
import { formatDateTime } from '@/utilities/formatDateTime'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import type { Metadata } from 'next'
import Link from 'next/link'
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

  const publishedAt = post.firstPublishedAt || post.createdAt

  return (
    <Container className="py-16 md:py-20">
      {draft ? <LivePreviewListener /> : null}

      <article className="container mx-auto max-w-3xl">
        <Link className="text-muted-foreground text-sm hover:underline" href="/blog">
          Back to blog
        </Link>

        {publishedAt ? (
          <p className="text-muted-foreground pt-6 text-sm">{formatDateTime(publishedAt)}</p>
        ) : null}

        <h1 className="pt-2 text-4xl font-bold tracking-tight md:text-5xl">{post.title}</h1>

        {post.content ? (
          <RichText className="pt-8" data={post.content} enableGutter={false} />
        ) : null}
      </article>
    </Container>
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
  const description = `Read ${post.title} on the MIKECEBUL blog.`

  return {
    description,
    openGraph: mergeOpenGraph({
      description,
      title,
      url: `${baseUrl}/blog/${post.slug}`,
    }),
    title,
  }
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
