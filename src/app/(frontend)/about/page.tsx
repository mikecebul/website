import { MarketingAboutPage } from '@/components/marketing/marketing-pages'
import { createMarketingMetadata } from '@/lib/marketing-metadata'
import { websiteContent } from '@/lib/website-content'

export const metadata = createMarketingMetadata({
  description: websiteContent.seo.about.description,
  pathname: '/about',
  title: websiteContent.seo.about.title,
})

export default function AboutPage() {
  return <MarketingAboutPage />
}
