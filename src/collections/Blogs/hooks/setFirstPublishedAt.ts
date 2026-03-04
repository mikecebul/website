import type { CollectionBeforeChangeHook } from 'payload'

export const setFirstPublishedAt: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  if (!data) return data

  const nextStatus = data._status ?? originalDoc?._status
  if (nextStatus !== 'published') return data

  if (originalDoc?.firstPublishedAt) {
    return {
      ...data,
      firstPublishedAt: originalDoc.firstPublishedAt,
    }
  }

  if (data.firstPublishedAt) {
    return data
  }

  return {
    ...data,
    firstPublishedAt: new Date().toISOString(),
  }
}
