import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () => {
        const baseUrl =
          process.env.VITE_SERVER_URL ||
          process.env.NEXT_PUBLIC_SERVER_URL ||
          'http://localhost:3000'
        const content =
          process.env.VITE_IS_LIVE === 'false' || process.env.NEXT_PUBLIC_IS_LIVE === 'false'
            ? 'User-agent: *\nDisallow: /\n'
            : `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /login\nDisallow: /next\nDisallow: /sentry-example-page\nHost: ${baseUrl}\nSitemap: ${baseUrl}/sitemap.xml\n`
        return new Response(content, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
      },
    },
  },
})
