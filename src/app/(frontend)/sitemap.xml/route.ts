import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { baseUrl } from '@/utilities/baseUrl'
import { unstable_cache } from 'next/cache'

const getSitemap = unstable_cache(
  async () => {
    if (process.env.NEXT_PUBLIC_IS_LIVE === 'false') {
      return []
    }

    const payload = await getPayload({ config: configPromise })
    const [{ docs: pages }, { docs: blogs }] = await Promise.all([
      payload.find({
        collection: 'pages',
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
      }),
      payload.find({
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
      }),
    ])

    const dateFallback = new Date().toISOString()

    const pageSitemap = pages
      .filter((page) => Boolean(page.slug))
      .map((page) => ({
        loc: `${baseUrl}${page.slug === 'home' ? '' : `/${page.slug}`}`,
        lastmod: page.updatedAt || dateFallback,
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

    const blogIndex = {
      loc: `${baseUrl}/blog`,
      lastmod: latestBlogUpdate || dateFallback,
    }

    return [...pageSitemap, blogIndex, ...blogSitemap]
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
