import { createFileRoute } from '@tanstack/react-router'
import { createMarketingHead } from '@/lib/marketing-metadata'
import { MarketingServicesPage } from '@/components/marketing/marketing-pages'
import { automationServicesJsonLd, JsonLd } from '@/components/seo/json-ld'
import { createMarketingMetadata } from '@/lib/marketing-metadata'
import { websiteContent } from '@/lib/website-content'

const metadata = createMarketingMetadata({
  description: websiteContent.seo.services.description,
  keywords: websiteContent.seo.services.keywords,
  pathname: '/services',
  title: websiteContent.seo.services.title,
})

function ServicesPage() {
  return (
    <>
      <JsonLd data={automationServicesJsonLd} />
      <MarketingServicesPage />
    </>
  )
}

export const Route = createFileRoute('/_marketing/services')({
  head: () => createMarketingHead(metadata),
  component: ServicesPage,
})
