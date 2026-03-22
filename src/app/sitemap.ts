import configPromise from '@payload-config'
import type { MetadataRoute } from 'next'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import { baseUrl } from '@/lib/baseUrl'
import { websiteContent } from '@/lib/website-content'

const getSitemap = unstable_cache(
  async (): Promise<MetadataRoute.Sitemap> => {
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
      select: {
        slug: true,
        updatedAt: true,
      },
      where: {
        _status: {
          equals: 'published',
        },
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

    const latestBlogUpdate = blogs
      .map((blog) => blog.updatedAt)
      .filter((updatedAt): updatedAt is string => Boolean(updatedAt))
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]

    const marketingEntries = marketingRoutes.map((route) => ({
      lastModified: route === '/blog' ? latestBlogUpdate || dateFallback : dateFallback,
      url: `${baseUrl}${route}`,
    }))

    const blogEntries = blogs
      .filter((blog) => Boolean(blog.slug))
      .map((blog) => ({
        lastModified: blog.updatedAt || dateFallback,
        url: `${baseUrl}/blog/${blog.slug}`,
      }))

    return [...marketingEntries, ...blogEntries]
  },
  ['sitemap'],
  {
    tags: ['sitemap'],
  },
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getSitemap()
}
