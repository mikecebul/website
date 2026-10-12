import { createFileRoute, notFound } from '@tanstack/react-router'
import NotFoundPage from '@/components/not-found'
export const Route = createFileRoute('/_marketing/$')({
  loader: () => {
    throw notFound()
  },
  notFoundComponent: NotFoundPage,
})
