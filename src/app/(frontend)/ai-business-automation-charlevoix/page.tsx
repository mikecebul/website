import { FocusedServicePage } from '@/components/marketing/focused-service-page'
import { JsonLd, aiBusinessAutomationJsonLd } from '@/components/seo/json-ld'
import { createMarketingMetadata } from '@/lib/marketing-metadata'
import { websiteContent } from '@/lib/website-content'

export const metadata = createMarketingMetadata({
  description: websiteContent.seo.aiBusinessAutomation.description,
  keywords: websiteContent.seo.aiBusinessAutomation.keywords,
  pathname: '/ai-business-automation-charlevoix',
  title: websiteContent.seo.aiBusinessAutomation.title,
})

export default function AiBusinessAutomationPage() {
  return (
    <>
      <JsonLd data={aiBusinessAutomationJsonLd} />
      <FocusedServicePage service={websiteContent.focusedServices.aiAutomation} />
    </>
  )
}
