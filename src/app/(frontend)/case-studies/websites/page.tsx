import { MarketingCaseStudyPage } from '@/components/marketing/marketing-pages'
import { createMarketingMetadata } from '@/lib/marketing-metadata'
import { getCaseStudyBySlug, websiteContent } from '@/lib/website-content'

const caseStudy = getCaseStudyBySlug('websites')

export const metadata = createMarketingMetadata({
  description: websiteContent.seo.caseStudies.websites.description,
  pathname: '/case-studies/websites',
  title: websiteContent.seo.caseStudies.websites.title,
})

export default function WebsitesCaseStudyPage() {
  if (!caseStudy) {
    return null
  }

  return <MarketingCaseStudyPage caseStudy={caseStudy} />
}
