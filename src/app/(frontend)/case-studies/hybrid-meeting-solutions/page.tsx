import { MarketingCaseStudyPage } from '@/components/marketing/marketing-pages'
import { hybridMeetingCaseStudyJsonLd, JsonLd } from '@/components/seo/json-ld'
import { createMarketingMetadata } from '@/lib/marketing-metadata'
import { getCaseStudyBySlug, websiteContent } from '@/lib/website-content'

const caseStudy = getCaseStudyBySlug('hybrid-meeting-solutions')

export const metadata = createMarketingMetadata({
  description: websiteContent.seo.caseStudies.hybridMeetingSolutions.description,
  keywords: websiteContent.seo.caseStudies.hybridMeetingSolutions.keywords,
  pathname: '/case-studies/hybrid-meeting-solutions',
  title: websiteContent.seo.caseStudies.hybridMeetingSolutions.title,
})

export default function HybridMeetingSolutionsCaseStudyPage() {
  if (!caseStudy) {
    return null
  }

  return (
    <>
      <JsonLd data={hybridMeetingCaseStudyJsonLd} />
      <MarketingCaseStudyPage caseStudy={caseStudy} />
    </>
  )
}
