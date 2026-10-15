import { createServerFn } from '@tanstack/react-start'
import { toJournalPost } from '@/lib/blog-presentation'

export const getBlogIndex = createServerFn({ method: 'GET' })
  .validator((data: { page: number }) => ({ page: Math.max(1, Math.floor(data.page) || 1) }))
  .handler(async ({ data }) => {
    const { getCMS } = await import('./cms')
    const payload = await getCMS()
    const result = await payload.find({
      collection: 'blogs',
      depth: 1,
      draft: false,
      limit: 10,
      overrideAccess: false,
      page: data.page,
      sort: '-firstPublishedAt',
      where: { _status: { equals: 'published' } },
      select: {
        title: true,
        slug: true,
        firstPublishedAt: true,
        createdAt: true,
        featuredImage: true,
        content: true,
        summary: true,
        topic: true,
      },
    })
    return {
      ...result,
      docs: result.docs.map(toJournalPost),
    }
  })

export const getBlogPost = createServerFn({ method: 'GET' })
  .validator((data: { slug: string }) => ({ slug: String(data.slug) }))
  .handler(async ({ data }) => {
    const { getCMS } = await import('./cms')
    const { getPreviewUser } = await import('./preview')
    const payload = await getCMS()
    const user = await getPreviewUser(payload)
    const draft = Boolean(user)
    const result = await payload.find({
      collection: 'blogs',
      depth: 1,
      draft,
      limit: 1,
      overrideAccess: false,
      user: user ?? undefined,
      pagination: false,
      where: draft
        ? { slug: { equals: data.slug } }
        : { and: [{ slug: { equals: data.slug } }, { _status: { equals: 'published' } }] },
    })
    const post = result.docs[0]
    const related = post
      ? await payload.find({
          collection: 'blogs',
          depth: 1,
          draft: false,
          limit: 2,
          overrideAccess: false,
          sort: '-firstPublishedAt',
          where: { and: [{ _status: { equals: 'published' } }, { id: { not_equals: post.id } }] },
          select: {
            title: true,
            slug: true,
            featuredImage: true,
            topic: true,
            summary: true,
            content: true,
            firstPublishedAt: true,
            createdAt: true,
          },
        })
      : null
    return {
      post: post ? { ...post, content: JSON.stringify(post.content) } : null,
      relatedPosts: related?.docs.map(toJournalPost) || [],
      draft,
    }
  })
