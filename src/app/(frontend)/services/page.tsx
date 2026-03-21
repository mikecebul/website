import { MarketingServicesPage } from '@/components/marketing/marketing-pages'
import { createMarketingMetadata } from '@/lib/marketing-metadata'
import { websiteContent } from '@/lib/website-content'

export const metadata = createMarketingMetadata({
  description: websiteContent.seo.services.description,
  pathname: '/services',
  title: websiteContent.seo.services.title,
})

export default function ServicesPage() {
  return <MarketingServicesPage />
}
