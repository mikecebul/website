import { HybridMeetingSolutionsPage } from '@/components/marketing/hybrid-meeting-solutions'
import { hybridMeetingServiceJsonLd, JsonLd } from '@/components/seo/json-ld'
import { createMarketingMetadata } from '@/lib/marketing-metadata'
import { websiteContent } from '@/lib/website-content'

export const metadata = createMarketingMetadata({
  ...websiteContent.seo.hybridMeetingSolutions,
  pathname: '/hybrid-meeting-solutions',
})

export default function HybridMeetingsPage() {
  return (
    <>
      <JsonLd data={hybridMeetingServiceJsonLd} />
      <HybridMeetingSolutionsPage />
    </>
  )
}
