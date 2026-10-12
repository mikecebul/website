import { createFileRoute } from '@tanstack/react-router'
import { createMarketingHead } from '@/lib/marketing-metadata'
import { MarketingHomePage } from '@/components/marketing/marketing-pages'
import { createMarketingMetadata } from '@/lib/marketing-metadata'
import { websiteContent } from '@/lib/website-content'

const metadata = createMarketingMetadata({
  description: websiteContent.seo.home.description,
  keywords: websiteContent.seo.home.keywords,
  pathname: '/',
  title: websiteContent.seo.home.title,
})

function HomePage() {
  return <MarketingHomePage />
}

export const Route = createFileRoute('/_marketing/')({
  head: () => createMarketingHead(metadata),
  component: HomePage,
})
