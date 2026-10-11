import configPromise from '@payload-config'
import Link from 'next/link'
import { ArrowUpRight, NotebookPen } from 'lucide-react'
import { AngularFrame, PageFrame, WebsiteAction } from '@/components/marketing/design-system'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  MarketingBlogIntro,
  MarketingBlogContactCard,
} from '@/components/marketing/marketing-pages'
import { createMarketingMetadata } from '@/lib/marketing-metadata'
import { websiteContent } from '@/lib/website-content'
import { formatDateTime } from '@/lib/formatDateTime'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

const BLOGS_PER_PAGE = 10

type PageProps = {
  searchParams: Promise<{
    page?: string | string[]
  }>
}

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

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { page } = await searchParams
  const requestedPage = getRequestedPage(page)
  const pathname = getPageHref(requestedPage)

  if (requestedPage <= 1) {
    return createMarketingMetadata({
      description: websiteContent.seo.blogIndex.description,
      keywords: websiteContent.seo.blogIndex.keywords,
      pathname,
      title: websiteContent.seo.blogIndex.title,
    })
  }

  return createMarketingMetadata({
    description: `Page ${requestedPage} of articles on websites, automation, and hybrid collaboration systems.`,
    keywords: websiteContent.seo.blogIndex.keywords,
    pathname,
    title: `Blog Page ${requestedPage} | Mike Cebulski`,
  })
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

export default async function BlogIndexPage({ searchParams }: PageProps) {
  const payload = await getPayload({ config: configPromise })
  const { page } = await searchParams

  const requestedPage = getRequestedPage(page)

  const result = await payload.find({
    collection: 'blogs',
    depth: 1,
    draft: false,
    limit: BLOGS_PER_PAGE,
    overrideAccess: false,
    page: requestedPage,
    sort: '-firstPublishedAt',
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  if (result.totalDocs === 0 && requestedPage > 1) {
    redirect('/blog')
  }

  if (result.totalDocs > 0 && requestedPage > result.totalPages) {
    redirect(getPageHref(result.totalPages))
  }

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
              return (
                <article
                  key={post.id}
                  className={`web-panel web-journal-post${index === 0 ? ' web-journal-featured' : ''}`}
                >
                  <AngularFrame />
                  <p className="web-eyebrow">{index === 0 ? 'Latest note' : 'From the journal'}</p>
                  {publishedAt ? (
                    <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
                  ) : null}
                  <h2>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <Link
                    className="web-text-link"
                    href={`/blog/${post.slug}`}
                    aria-label={`Read ${post.title}`}
                  >
                    Read the article
                    <ArrowUpRight aria-hidden="true" />
                  </Link>
                </article>
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

        <div className="web-journal-sidebar">
          <MarketingBlogContactCard />
        </div>
      </section>
    </PageFrame>
  )
}
