import { MarketingServicesPage } from '@/components/marketing/marketing-pages'
import { automationServicesJsonLd, JsonLd } from '@/components/seo/json-ld'
import { createMarketingMetadata } from '@/lib/marketing-metadata'
import { websiteContent } from '@/lib/website-content'

export const metadata = createMarketingMetadata({
  description: websiteContent.seo.services.description,
  keywords: websiteContent.seo.services.keywords,
  pathname: '/services',
  title: websiteContent.seo.services.title,
})

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={automationServicesJsonLd} />
      <MarketingServicesPage />
    </>
  )
}
