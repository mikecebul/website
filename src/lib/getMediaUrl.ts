import { getClientSideURL } from './getURL'

/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  const appendCacheTag = (source: string): string => {
    if (!cacheTag) return source
    const separator = source.includes('?') ? '&' : '?'
    return `${source}${separator}${encodeURIComponent(cacheTag)}`
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const parsed = new URL(url)
      const isPrivateLocalhost = ['localhost', '127.0.0.1', '::1'].includes(parsed.hostname)
      const currentOrigin = getClientSideURL()

      // Keep same-origin/local media paths relative so Next image optimization does not treat them as remote.
      if (isPrivateLocalhost || (currentOrigin && parsed.origin === currentOrigin)) {
        return `${parsed.pathname}${parsed.search}`
      }
    } catch {
      return appendCacheTag(url)
    }

    return appendCacheTag(url)
  }

  // Prefer relative local media paths (e.g. /api/media/file/...) for Next image optimizer compatibility.
  if (url.startsWith('/')) {
    return url
  }

  const baseUrl = getClientSideURL()
  const normalized = baseUrl ? `${baseUrl}/${url.replace(/^\/+/, '')}` : url
  return appendCacheTag(normalized)
}
