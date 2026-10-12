import { WebDevelopmentHomePage } from '@/components/marketing/web-development'
import { JsonLd, websitePackageJsonLd } from '@/components/seo/json-ld'
import { createMarketingMetadata } from '@/lib/marketing-metadata'
import { websiteContent } from '@/lib/website-content'

export const metadata = createMarketingMetadata({
  description: websiteContent.seo.home.description,
  keywords: websiteContent.seo.home.keywords,
  pathname: '/',
  title: websiteContent.seo.home.title,
})

export default function HomePage() {
  return (
    <>
      <JsonLd data={websitePackageJsonLd} />
      <WebDevelopmentHomePage />
    </>
  )
}
