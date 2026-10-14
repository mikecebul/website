import { createFileRoute } from '@tanstack/react-router'
import { baseUrl } from '@/lib/baseUrl'
import { websitePaths } from '@/lib/website-content'
import { getBlogImages } from '@/lib/blog-seo'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const { getCMS } = await import('@/server/cms')
        const isLive = process.env.IS_LIVE !== 'false'
        const xmlEscape = (value: string) =>
          value.replace(
            /[<>&'"]/g,
            (char) =>
              ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char]!,
          )
        let entries: { url: string; lastModified?: string; images?: string[] }[] = []
        if (isLive) {
          const payload = await getCMS()
          const { docs: blogs } = await payload.find({
            collection: 'blogs',
            draft: false,
            limit: 1000,
            overrideAccess: false,
            pagination: false,
            depth: 1,
            select: { slug: true, updatedAt: true, content: true },
            where: { _status: { equals: 'published' } },
          })
          const latest = blogs
            .map((blog) => blog.updatedAt)
            .sort()
            .at(-1)
          entries = Object.values(websitePaths).map((path) => ({
            url: new URL(path, baseUrl).toString(),
            lastModified: path === '/blog' ? latest : undefined,
          }))
          entries.push(
            ...blogs
              .filter((blog) => blog.slug)
              .map((blog) => ({
                url: new URL(`/blog/${blog.slug}`, baseUrl).toString(),
                lastModified: blog.updatedAt,
                images: getBlogImages(blog.content?.root).map((image) =>
                  new URL(image.url!, baseUrl).toString(),
                ),
              })),
          )
        }
        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${entries.map((entry) => `<url><loc>${xmlEscape(entry.url)}</loc>${entry.lastModified ? `<lastmod>${xmlEscape(entry.lastModified)}</lastmod>` : ''}${(entry.images ?? []).map((url) => `<image:image><image:loc>${xmlEscape(url)}</image:loc></image:image>`).join('')}</url>`).join('')}</urlset>`,
          { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
        )
      },
    },
  },
})
