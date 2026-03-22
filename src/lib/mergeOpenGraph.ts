import type { Metadata } from 'next'

import { baseUrl } from './baseUrl'
import { websiteContent } from './website-content'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  url: baseUrl,
  title: websiteContent.site.name,
  description: websiteContent.site.description,
  images: [
    {
      url: new URL(websiteContent.seo.defaultOgImage, baseUrl).toString(),
    },
  ],
  siteName: websiteContent.site.legalName,
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
