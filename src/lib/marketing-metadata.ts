import { baseUrl } from '@/lib/baseUrl'
import { websiteContent } from '@/lib/website-content'

type MetadataInput = {
  description: string
  keywords?: string[]
  ogType?: 'article' | 'website'
  pathname: string
  title: string
}

export const createMarketingMetadata = (input: MetadataInput) => input

export function createMarketingHead({
  description,
  keywords,
  ogType = 'website',
  pathname,
  title,
}: MetadataInput) {
  const canonical = new URL(pathname, baseUrl).toString()
  const ogImage = new URL(websiteContent.seo.defaultOgImage, baseUrl).toString()
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      ...(keywords?.length ? [{ name: 'keywords', content: keywords.join(', ') }] : []),
      { name: 'author', content: websiteContent.site.name },
      { name: 'creator', content: websiteContent.site.name },
      { name: 'publisher', content: websiteContent.site.legalName },
      { name: 'robots', content: 'index, follow' },
      {
        name: 'googlebot',
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: ogType },
      { property: 'og:url', content: canonical },
      { property: 'og:image', content: ogImage },
      { property: 'og:locale', content: 'en_US' },
      { property: 'og:site_name', content: websiteContent.site.legalName },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:creator', content: '@mikecebul' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage },
    ],
    links: [{ rel: 'canonical', href: canonical }],
  }
}
