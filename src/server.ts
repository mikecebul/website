import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server'
import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN),
})

const handler = createStartHandler(defaultStreamHandler)
export default {
  async fetch(request: Request) {
    const url = new URL(request.url)
    if (
      request.headers.get('user-agent')?.includes('Trident') &&
      url.pathname !== '/ie-incompatible.html'
    )
      return Response.redirect(new URL('/ie-incompatible.html', url), 307)
    const movedPages: Record<string, string> = {
      '/services': '/websites',
      '/case-studies/websites': '/websites',
      '/case-studies/hybrid-meeting-solutions': '/hybrid-meeting-solutions',
    }
    if (movedPages[url.pathname])
      return Response.redirect(new URL(movedPages[url.pathname], url), 308)
    if (url.pathname === '/home' || url.pathname === '/wp' || url.pathname.startsWith('/wp/'))
      return Response.redirect(new URL('/', url), 308)
    if (/^\/rdfk\.[^.]+$/.test(url.pathname)) return Response.redirect(new URL('/rdfk', url), 307)
    try {
      return await handler(request)
    } catch (error) {
      Sentry.captureException(error)
      throw error
    }
  },
}
