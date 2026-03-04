import { revalidatePath, revalidateTag } from 'next/cache'
import type { CollectionAfterDeleteHook } from 'payload'

export const revalidateDelete: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
  if (context.disableRevalidate) {
    return doc
  }

  revalidatePath('/blog')

  if (doc?.slug) {
    revalidatePath(`/blog/${doc.slug}`)
  }

  revalidateTag('sitemap', 'max')

  return doc
}
