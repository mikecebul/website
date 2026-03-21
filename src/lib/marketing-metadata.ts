import type { Metadata } from 'next'

import { baseUrl } from '@/utilities/baseUrl'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { websiteContent } from '@/lib/website-content'

type MetadataInput = {
  description: string
  pathname: string
  title: string
}

export const createMarketingMetadata = ({
  description,
  pathname,
  title,
}: MetadataInput): Metadata => ({
  description,
  metadataBase: new URL(baseUrl),
  openGraph: mergeOpenGraph({
    description,
    images: [{ url: websiteContent.seo.defaultOgImage }],
    title,
    url: pathname,
  }),
  title,
  twitter: {
    card: 'summary_large_image',
    creator: '@mikecebul',
    title,
  },
})
