import { NotebookPen, ArrowUpRight, PanelsTopLeft, Workflow, Video } from 'lucide-react'
import { AngularFrame, PageFrame, WebsiteAction } from '@/components/marketing/design-system'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { getBlogIndex } from '@/server/blog.functions'
import { createMarketingHead } from '@/lib/marketing-metadata'
import Link from '@/components/router-link'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { MarketingBlogIntro } from '@/components/marketing/marketing-pages'
import { websiteContent } from '@/lib/website-content'
import { formatBlogDate, getBlogTopicLabel } from '@/lib/blog-presentation'
import { Fragment } from 'react'
import { JournalContact } from '@/components/marketing/journal-contact'
import { getBlogFeaturedImage } from '@/lib/blog-seo'
import { Media } from '@/components/Media'
import { cn } from '@/lib/utils'

const BLOGS_PER_PAGE = 10
type PageItem = number | 'ellipsis'

const getRequestedPage = (pageParam?: string | string[]) => {
  const value = Array.isArray(pageParam) ? pageParam[0] : pageParam
  if (!value) return 1

  const page = Number.parseInt(value, 10)
  if (!Number.isFinite(page) || page <= 0) {
    return 1
  }

  return page
}

const getPageHref = (page: number) => {
  if (page <= 1) return '/blog'

  return `/blog?page=${page}`
}

const getPageItems = (currentPage: number, totalPages: number): PageItem[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const items: PageItem[] = [1]
  const left = Math.max(2, currentPage - 1)
  const right = Math.min(totalPages - 1, currentPage + 1)

  if (left > 2) {
    items.push('ellipsis')
  }

  for (let page = left; page <= right; page += 1) {
    items.push(page)
  }

  if (right < totalPages - 1) {
    items.push('ellipsis')
  }

  items.push(totalPages)

  return items
}

export const Route = createFileRoute('/_marketing/blog/')({
  validateSearch: (search: Record<string, unknown>) => ({
    page:
      search.page == null
        ? undefined
        : getRequestedPage(
            typeof search.page === 'string' || typeof search.page === 'number'
              ? String(search.page)
              : undefined,
          ),
  }),
  loaderDeps: ({ search }) => ({ page: search.page ?? 1 }),
  loader: async ({ deps }) => {
    const result = await getBlogIndex({ data: { page: deps.page } })
    if (result.totalDocs === 0 && deps.page > 1)
      throw redirect({ to: '/blog', search: { page: 1 } })
    if (result.totalDocs > 0 && deps.page > result.totalPages)
      throw redirect({ to: '/blog', search: { page: result.totalPages } })
    return { result, requestedPage: deps.page }
  },
  head: ({ loaderData }) => {
    const page = loaderData?.requestedPage ?? 1
    return createMarketingHead({
      description:
        page === 1
          ? websiteContent.seo.blogIndex.description
          : `Page ${page} of articles on websites, automation, and hybrid collaboration systems.`,
      keywords: websiteContent.seo.blogIndex.keywords,
      pathname: getPageHref(page),
      title: page === 1 ? websiteContent.seo.blogIndex.title : `Blog Page ${page} | Mike Cebulski`,
    })
  },
  component: BlogIndexPage,
})

function BlogIndexPage() {
  const { result, requestedPage } = Route.useLoaderData()
  const pageItems = getPageItems(requestedPage, result.totalPages)
  return (
    <PageFrame className="web-journal-page">
      <MarketingBlogIntro />
      <section className="web-container web-journal-grid">
        <div className="web-journal-posts">
          {result.docs.length === 0 ? (
            <Empty className="web-panel web-journal-empty">
              <AngularFrame />
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <NotebookPen aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>New notes are on the way.</EmptyTitle>
                <EmptyDescription>
                  No articles have been published yet. In the meantime, take a look at a few recent
                  projects.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <WebsiteAction href="/websites#selected-work">Explore the work</WebsiteAction>
              </EmptyContent>
            </Empty>
          ) : (
            result.docs.map((post, index) => {
              if (!post.slug) return null
              const publishedAt = post.firstPublishedAt || post.createdAt
              const image = getBlogFeaturedImage(post)
              const featured = requestedPage === 1 && index === 0
              return (
                <Fragment key={post.id}>
                  {index === (requestedPage === 1 ? 1 : 0) ? (
                    <h2 className="web-eyebrow web-journal-section-label">More from the journal</h2>
                  ) : null}
                  <article
                    className={cn('web-journal-post', {
                      'web-panel web-journal-featured': featured,
                      'web-journal-post-with-image': Boolean(image) || !featured,
                    })}
                  >
                    {featured ? <AngularFrame /> : null}
                    {image ? (
                      <Link
                        href={`/blog/${post.slug}`}
                        className="web-journal-post-image"
                        tabIndex={-1}
                        aria-hidden="true"
                      >
                        <Media resource={image} priority={featured} />
                      </Link>
                    ) : !featured ? (
                      <div
                        className="web-journal-post-image web-journal-post-placeholder"
                        aria-hidden="true"
                      >
                        {post.topic === 'websites' ? (
                          <PanelsTopLeft />
                        ) : post.topic === 'ai-workflows' ? (
                          <Workflow />
                        ) : post.topic === 'hybrid-meetings' ? (
                          <Video />
                        ) : (
                          <NotebookPen />
                        )}
                      </div>
                    ) : null}
                    <div className="web-journal-post-copy">
                      <p className="web-eyebrow">
                        {featured ? 'Latest note' : getBlogTopicLabel(post.topic)}
                      </p>
                      <p className="web-journal-post-meta">
                        {featured && post.topic ? (
                          <>
                            <span>{getBlogTopicLabel(post.topic)}</span>
                            <span aria-hidden="true">·</span>
                          </>
                        ) : null}
                        {publishedAt ? (
                          <>
                            <time dateTime={publishedAt}>{formatBlogDate(publishedAt)}</time>
                            <span aria-hidden="true">·</span>
                          </>
                        ) : null}
                        <span>{post.readingTime} min read</span>
                      </p>
                      <h2>
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                      <p className="web-copy web-journal-post-description">{post.description}</p>
                      <Link
                        className="web-text-link"
                        href={`/blog/${post.slug}`}
                        aria-label={`Read ${post.title}`}
                      >
                        <span className="web-journal-action-label">Read the article</span>
                        <ArrowUpRight aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                </Fragment>
              )
            })
          )}

          {result.totalDocs > BLOGS_PER_PAGE ? (
            <Pagination className="pt-6">
              <PaginationContent>
                {result.hasPrevPage && result.prevPage ? (
                  <PaginationItem>
                    <PaginationPrevious href={getPageHref(result.prevPage)} />
                  </PaginationItem>
                ) : null}

                {pageItems.map((item, index) => {
                  if (item === 'ellipsis') {
                    return (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  }

                  return (
                    <PaginationItem key={item}>
                      <PaginationLink href={getPageHref(item)} isActive={item === requestedPage}>
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}

                {result.hasNextPage && result.nextPage ? (
                  <PaginationItem>
                    <PaginationNext href={getPageHref(result.nextPage)} />
                  </PaginationItem>
                ) : null}
              </PaginationContent>
            </Pagination>
          ) : null}
        </div>
      </section>
      <JournalContact />
    </PageFrame>
  )
}
