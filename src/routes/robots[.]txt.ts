import { createFileRoute } from '@tanstack/react-router'
import { baseUrl } from '@/lib/baseUrl'

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () => {
        const content =
          process.env.VITE_IS_LIVE === 'false' || process.env.NEXT_PUBLIC_IS_LIVE === 'false'
            ? 'User-agent: *\nDisallow: /\n'
            : `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nDisallow: /next/\nSitemap: ${baseUrl}/sitemap.xml\n`
        return new Response(content, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
      },
    },
  },
})
