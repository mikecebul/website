import configPromise from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { MarketingBlogIntro, MarketingBlogNewsletterCard } from '@/components/marketing/marketing-pages'
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
    <main className="pt-8 pb-24 sm:pt-10 lg:pt-14 lg:pb-32">
      <MarketingBlogIntro />
      <section className="mx-auto mt-16 grid max-w-[1220px] gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:px-12">
        <div className="space-y-6">
          {result.docs.length === 0 ? (
            <article className="overflow-hidden rounded-[34px] border border-white/8 bg-[rgba(19,27,46,0.85)] p-8 shadow-[0_26px_70px_rgba(0,0,0,0.3)]">
              <p className="text-muted-foreground">No blog posts have been published yet.</p>
            </article>
          ) : (
            result.docs.map((post, index) => {
              if (!post.slug) return null

              const publishedAt = post.firstPublishedAt || post.createdAt
              const articleClassName =
                index === 0
                  ? 'overflow-hidden rounded-[34px] border border-white/8 bg-[rgba(19,27,46,0.85)] shadow-[0_26px_70px_rgba(0,0,0,0.3)]'
                  : 'grid gap-4 rounded-[28px] border border-white/8 bg-[rgba(19,27,46,0.85)] p-5'

              return (
                <article key={post.id} className={articleClassName}>
                  {index === 0 ? (
                    <>
                      <Image
                        alt={post.title}
                        className="h-[320px] w-full object-cover"
                        src={websiteContent.images.dataVisualization}
                        width={1600}
                        height={1200}
                        sizes="(min-width: 1024px) 60vw, 100vw"
                      />
                      <div className="p-8">
                        {publishedAt ? (
                          <p className="text-sm uppercase tracking-[0.28em] text-(--marketing-sky)">
                            {formatDateTime(publishedAt)}
                          </p>
                        ) : null}
                        <h2 className="mt-3 max-w-2xl font-heading text-4xl tracking-[-0.06em] text-(--marketing-heading)">
                          <Link className="transition-colors hover:text-(--marketing-gold)" href={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h2>
                      </div>
                    </>
                  ) : (
                    <div>
                      {publishedAt ? (
                        <p className="text-xs uppercase tracking-[0.28em] text-(--marketing-gold)">
                          {formatDateTime(publishedAt)}
                        </p>
                      ) : null}
                      <h3 className="mt-3 font-heading text-2xl tracking-[-0.04em] text-(--marketing-heading)">
                        <Link className="transition-colors hover:text-(--marketing-gold)" href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>
                    </div>
                  )}
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

        <div className="grid gap-6">
          <MarketingBlogNewsletterCard />
        </div>
      </section>
    </main>
  )
}
