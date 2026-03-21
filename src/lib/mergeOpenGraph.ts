import type { Metadata } from 'next'
import { baseUrl } from './baseUrl'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  url: baseUrl,
  title: 'MIKECEBUL - Technology Consultant',
  description: 'Full-stack software engineer and consultant specializing in modern web development, React, Next.js, and cloud solutions.',
  images: [
    {
      url: `${baseUrl}/flowers-sign-meta.webp`,
    },
  ],
  siteName: 'MIKECEBUL',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
