import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { payloadParseSearch, payloadStringifySearch } from '@payloadcms/tanstack-start/shared'

export function getRouter() {
  const router = createTanStackRouter({
    parseSearch: payloadParseSearch,
    routeTree,
    stringifySearch: payloadStringifySearch,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
