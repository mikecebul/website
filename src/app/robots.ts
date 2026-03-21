import { MetadataRoute } from 'next'
import { baseUrl } from '@/utilities/baseUrl'

export default async function robots(): Promise<MetadataRoute.Robots> {
  if (process.env.NEXT_PUBLIC_IS_LIVE === 'false') {
    return {
      rules: {
        userAgent: '*',
        disallow: ['/'],
      },
    }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
