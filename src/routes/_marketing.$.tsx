import { createFileRoute, notFound } from '@tanstack/react-router'
import NotFoundPage from '@/components/not-found'
export const Route = createFileRoute('/_marketing/$')({
  head: () => ({
    meta: [
      { title: 'Page not found | Mike Cebulski' },
      { name: 'robots', content: 'noindex, nofollow' },
      { name: 'googlebot', content: 'noindex, nofollow' },
    ],
  }),
  loader: () => {
    throw notFound()
  },
  notFoundComponent: NotFoundPage,
})
