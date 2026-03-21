import configPromise from '@payload-config'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { RichText } from '@/components/RichText'
import { createMarketingMetadata } from '@/lib/marketing-metadata'
import { formatDateTime } from '@/lib/formatDateTime'
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
    <main className="pt-8 pb-24 sm:pt-10 lg:pt-14 lg:pb-32">
      {draft ? <LivePreviewListener /> : null}

      <section className="mx-auto max-w-[1220px] px-4 pt-6 sm:px-6 lg:px-12">
        <Link className="text-sm text-(--marketing-copy) transition-colors hover:text-(--marketing-gold)" href="/blog">
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
          <RichText className="marketing-richtext" data={post.content} enableGutter={false} />
        ) : null}
      </article>
    </main>
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

  return createMarketingMetadata({
    description,
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
