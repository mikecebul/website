import { baseUrl } from '@/lib/baseUrl'
import { websiteContent } from '@/lib/website-content'
import { createPageJsonLd } from '@/components/seo/json-ld'

type MetadataInput = {
  description: string
  keywords?: string[]
  ogType?: 'article' | 'website'
  pathname: string
  title: string
  image?: { url: string; alt: string; width?: number; height?: number }
  noindex?: boolean
  publishedAt?: string | null
  modifiedAt?: string | null
}

export const createMarketingMetadata = (input: MetadataInput) => input

export function createMarketingHead({
  description,
  keywords,
  ogType = 'website',
  pathname,
  title,
  image,
  noindex = false,
  publishedAt,
  modifiedAt,
}: MetadataInput) {
  const canonical = new URL(pathname, baseUrl).toString()
  const ogImage = new URL(image?.url || websiteContent.seo.defaultOgImage, baseUrl).toString()
  const imageAlt =
    image?.alt || 'Mike Cebulski — websites and technology services in Northern Michigan'
  const robots = noindex ? 'noindex, nofollow' : 'index, follow'
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      ...(keywords?.length ? [{ name: 'keywords', content: keywords.join(', ') }] : []),
      { name: 'author', content: websiteContent.site.name },
      { name: 'creator', content: websiteContent.site.name },
      { name: 'publisher', content: websiteContent.site.legalName },
      { name: 'robots', content: robots },
      {
        name: 'googlebot',
        content: noindex
          ? robots
          : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: ogType },
      { property: 'og:url', content: canonical },
      { property: 'og:image', content: ogImage },
      { property: 'og:image:alt', content: imageAlt },
      ...(image?.width ? [{ property: 'og:image:width', content: String(image.width) }] : []),
      ...(image?.height ? [{ property: 'og:image:height', content: String(image.height) }] : []),
      ...(ogType === 'article' && publishedAt
        ? [{ property: 'article:published_time', content: publishedAt }]
        : []),
      ...(ogType === 'article' && modifiedAt
        ? [{ property: 'article:modified_time', content: modifiedAt }]
        : []),
      ...(ogType === 'article'
        ? [{ property: 'article:author', content: new URL('/about', baseUrl).toString() }]
        : []),
      { property: 'og:locale', content: 'en_US' },
      { property: 'og:site_name', content: websiteContent.site.legalName },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:creator', content: '@mikecebul' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage },
      { name: 'twitter:image:alt', content: imageAlt },
    ],
    links: [{ rel: 'canonical', href: canonical }],
    scripts: noindex
      ? []
      : [
          {
            type: 'application/ld+json',
            children: JSON.stringify(createPageJsonLd({ title, description, pathname })).replace(
              /</g,
              '\\u003c',
            ),
          },
        ],
  }
}
