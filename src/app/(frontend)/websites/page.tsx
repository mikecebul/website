import { WebDevelopmentWebsitesPage } from '@/components/marketing/web-development'
import { websitePackageJsonLd, JsonLd } from '@/components/seo/json-ld'
import { createMarketingMetadata } from '@/lib/marketing-metadata'
import { websiteContent } from '@/lib/website-content'

export const metadata = createMarketingMetadata({
  ...websiteContent.seo.websites,
  pathname: '/websites',
})

export default function WebsitesPage() {
  return (
    <>
      <JsonLd data={websitePackageJsonLd} />
      <WebDevelopmentWebsitesPage />
    </>
  )
}
