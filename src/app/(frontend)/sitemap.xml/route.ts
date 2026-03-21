import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { baseUrl } from '@/utilities/baseUrl'
import { websiteContent } from '@/lib/website-content'
import { unstable_cache } from 'next/cache'

const getSitemap = unstable_cache(
  async () => {
    if (process.env.NEXT_PUBLIC_IS_LIVE === 'false') {
      return []
    }

    const payload = await getPayload({ config: configPromise })
    const { docs: blogs } = await payload.find({
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
          updatedAt: true,
        },
      })

    const dateFallback = new Date().toISOString()
    const marketingRoutes = [
      '',
      '/services',
      '/about',
      '/contact',
      '/blog',
      ...websiteContent.caseStudies.map((caseStudy) => `/case-studies/${caseStudy.slug}`),
    ]
    const pageSitemap = marketingRoutes.map((route) => ({
      lastmod: dateFallback,
      loc: `${baseUrl}${route}`,
    }))

    const blogSitemap = blogs
      .filter((blog) => Boolean(blog.slug))
      .map((blog) => ({
        loc: `${baseUrl}/blog/${blog.slug}`,
        lastmod: blog.updatedAt || dateFallback,
      }))

    const latestBlogUpdate = blogs
      .map((blog) => blog.updatedAt)
      .filter((updatedAt): updatedAt is string => Boolean(updatedAt))
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]

    const updatedPageSitemap = pageSitemap.map((entry) =>
      entry.loc === `${baseUrl}/blog` ? { ...entry, lastmod: latestBlogUpdate || dateFallback } : entry,
    )

    return [...updatedPageSitemap, ...blogSitemap]
  },
  ['sitemap'],
  {
    tags: ['sitemap'],
  },
)

export async function GET() {
  const sitemap = await getSitemap()

  return getServerSideSitemap(sitemap)
}
