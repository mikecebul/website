import { createFileRoute } from '@tanstack/react-router'
import { createMarketingHead } from '@/lib/marketing-metadata'
import { HybridMeetingSolutionsPage } from '@/components/marketing/hybrid-meeting-solutions'
import { hybridMeetingServiceJsonLd, JsonLd } from '@/components/seo/json-ld'
import { createMarketingMetadata } from '@/lib/marketing-metadata'
import { websiteContent } from '@/lib/website-content'

const metadata = createMarketingMetadata({
  ...websiteContent.seo.hybridMeetingSolutions,
  pathname: '/hybrid-meeting-solutions',
})

function HybridMeetingsPage() {
  return (
    <>
      <JsonLd data={hybridMeetingServiceJsonLd} />
      <HybridMeetingSolutionsPage />
    </>
  )
}

export const Route = createFileRoute('/_marketing/hybrid-meeting-solutions')({
  component: HybridMeetingsPage,
  head: () => createMarketingHead(metadata),
})
