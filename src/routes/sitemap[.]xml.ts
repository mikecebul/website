import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const { getCMS } = await import('@/server/cms')
        const baseUrl =
          process.env.VITE_SERVER_URL ||
          process.env.NEXT_PUBLIC_SERVER_URL ||
          'http://localhost:3000'
        const isLive =
          process.env.VITE_IS_LIVE !== 'false' && process.env.NEXT_PUBLIC_IS_LIVE !== 'false'
        const xmlEscape = (value: string) =>
          value.replace(
            /[<>&'"]/g,
            (char) =>
              ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char]!,
          )
        let entries: { url: string; lastModified: string }[] = []
        if (isLive) {
          const payload = await getCMS()
          const { docs: blogs } = await payload.find({
            collection: 'blogs',
            draft: false,
            limit: 1000,
            overrideAccess: false,
            pagination: false,
            select: { slug: true, updatedAt: true },
            where: { _status: { equals: 'published' } },
          })
          const fallback = new Date().toISOString()
          const latest =
            blogs
              .map((blog) => blog.updatedAt)
              .sort()
              .at(-1) || fallback
          entries = [
            '',
            '/websites',
            '/hybrid-meeting-solutions',
            '/about',
            '/contact',
            '/blog',
          ].map((path) => ({
            url: `${baseUrl}${path}`,
            lastModified: path === '/blog' ? latest : fallback,
          }))
          entries.push(
            ...blogs
              .filter((blog) => blog.slug)
              .map((blog) => ({
                url: `${baseUrl}/blog/${blog.slug}`,
                lastModified: blog.updatedAt || fallback,
              })),
          )
        }
        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.map((entry) => `<url><loc>${xmlEscape(entry.url)}</loc><lastmod>${xmlEscape(entry.lastModified)}</lastmod></url>`).join('')}</urlset>`,
          { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
        )
      },
    },
  },
})
