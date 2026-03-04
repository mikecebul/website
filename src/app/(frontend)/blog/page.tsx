import configPromise from '@payload-config'
import Container from '@/components/Container'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { formatDateTime } from '@/utilities/formatDateTime'
import { getPayload } from 'payload'
import Link from 'next/link'
import { redirect } from 'next/navigation'

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
    <Container className="py-16 md:py-20">
      <div className="container mx-auto max-w-3xl">
        <h1 className="pb-10 text-4xl font-bold tracking-tight md:text-5xl">Blog</h1>

        {result.docs.length === 0 ? (
          <p className="text-muted-foreground">No blog posts have been published yet.</p>
        ) : (
          <div className="space-y-8">
            {result.docs.map((post) => {
              if (!post.slug) return null

              const publishedAt = post.firstPublishedAt || post.createdAt

              return (
                <article key={post.id} className="border-border border-b pb-6">
                  <p className="text-muted-foreground text-sm">
                    {publishedAt ? formatDateTime(publishedAt) : ''}
                  </p>
                  <h2 className="pt-2 text-2xl font-semibold tracking-tight">
                    <Link className="hover:underline" href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>
                </article>
              )
            })}
          </div>
        )}

        {result.totalDocs > BLOGS_PER_PAGE ? (
          <Pagination className="pt-10">
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
    </Container>
  )
}
