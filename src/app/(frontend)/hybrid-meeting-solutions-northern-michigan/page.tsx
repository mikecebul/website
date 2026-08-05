import { FocusedServicePage } from '@/components/marketing/focused-service-page'
import { JsonLd, hybridMeetingSolutionsJsonLd } from '@/components/seo/json-ld'
import { createMarketingMetadata } from '@/lib/marketing-metadata'
import { websiteContent } from '@/lib/website-content'

export const metadata = createMarketingMetadata({
  description: websiteContent.seo.hybridMeetingSolutions.description,
  keywords: websiteContent.seo.hybridMeetingSolutions.keywords,
  pathname: '/hybrid-meeting-solutions-northern-michigan',
  title: websiteContent.seo.hybridMeetingSolutions.title,
})

export default function HybridMeetingSolutionsPage() {
  return (
    <>
      <JsonLd data={hybridMeetingSolutionsJsonLd} />
      <FocusedServicePage service={websiteContent.focusedServices.hybridMeetings} />
    </>
  )
}
