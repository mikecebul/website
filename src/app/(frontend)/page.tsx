import { MarketingHomePage } from '@/components/marketing/marketing-pages'
import { createMarketingMetadata } from '@/lib/marketing-metadata'
import { websiteContent } from '@/lib/website-content'

export const metadata = createMarketingMetadata({
  description: websiteContent.seo.home.description,
  keywords: websiteContent.seo.home.keywords,
  pathname: '/',
  title: websiteContent.seo.home.title,
})

export default function HomePage() {
  return <MarketingHomePage />
}
