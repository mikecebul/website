import { revalidatePath, revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook } from 'payload'

const getBlogPostPath = (slug: string) => `/blog/${slug}`

export const revalidateBlog: CollectionAfterChangeHook = ({ doc, previousDoc, req: { payload } }) => {
  const shouldRevalidate = doc?._status === 'published' || previousDoc?._status === 'published'

  if (!shouldRevalidate) {
    return doc
  }

  const pathsToRevalidate = new Set<string>(['/blog'])

  if (doc?._status === 'published' && doc.slug) {
    pathsToRevalidate.add(getBlogPostPath(doc.slug))
  }

  if (previousDoc?._status === 'published' && previousDoc.slug) {
    pathsToRevalidate.add(getBlogPostPath(previousDoc.slug))
  }

  for (const path of pathsToRevalidate) {
    payload.logger.info(`Revalidating blog path: ${path}`)
    revalidatePath(path)
  }

  revalidateTag('sitemap', 'max')

  return doc
}
