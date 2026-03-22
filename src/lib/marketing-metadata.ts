import type { Metadata } from 'next'

import { baseUrl } from '@/lib/baseUrl'
import { mergeOpenGraph } from '@/lib/mergeOpenGraph'
import { websiteContent } from '@/lib/website-content'

type MetadataInput = {
  description: string
  keywords?: string[]
  ogType?: 'article' | 'website'
  pathname: string
  title: string
}

export const createMarketingMetadata = ({
  description,
  keywords,
  ogType = 'website',
  pathname,
  title,
}: MetadataInput): Metadata => {
  const ogImage = new URL(websiteContent.seo.defaultOgImage, baseUrl).toString()

  return {
    alternates: {
      canonical: pathname,
    },
    authors: [{ name: websiteContent.site.name }],
    creator: websiteContent.site.name,
    description,
    keywords,
    metadataBase: new URL(baseUrl),
    openGraph: mergeOpenGraph({
      description,
      images: [{ url: ogImage }],
      locale: 'en_US',
      title,
      type: ogType,
      url: pathname,
    }),
    publisher: websiteContent.site.legalName,
    robots: {
      follow: true,
      googleBot: {
        follow: true,
        index: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
      index: true,
    },
    title,
    twitter: {
      card: 'summary_large_image',
      creator: '@mikecebul',
      description,
      images: [ogImage],
      title,
    },
  }
}
