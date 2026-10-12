import { createFileRoute } from '@tanstack/react-router'
import { createMarketingHead } from '@/lib/marketing-metadata'
import { StitchWebPortfolioPage } from '@/components/marketing/stitch-web-portfolio-page'
import { JsonLd, webDesignPortfolioJsonLd } from '@/components/seo/json-ld'
import { createMarketingMetadata } from '@/lib/marketing-metadata'
import { websiteContent } from '@/lib/website-content'

const metadata = createMarketingMetadata({
  description: websiteContent.seo.caseStudies.websites.description,
  keywords: websiteContent.seo.caseStudies.websites.keywords,
  pathname: '/case-studies/websites',
  title: websiteContent.seo.caseStudies.websites.title,
})

function WebsitesCaseStudyPage() {
  return (
    <>
      <JsonLd data={webDesignPortfolioJsonLd} />
      <StitchWebPortfolioPage />
    </>
  )
}

export const Route = createFileRoute('/_marketing/case-studies/websites')({
  head: () => createMarketingHead(metadata),
  component: WebsitesCaseStudyPage,
})
