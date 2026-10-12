import { createFileRoute } from '@tanstack/react-router'
import { createMarketingHead } from '@/lib/marketing-metadata'
import { MarketingAboutPage } from '@/components/marketing/marketing-pages'
import { createMarketingMetadata } from '@/lib/marketing-metadata'
import { websiteContent } from '@/lib/website-content'

const metadata = createMarketingMetadata({
  description: websiteContent.seo.about.description,
  keywords: websiteContent.seo.about.keywords,
  pathname: '/about',
  title: websiteContent.seo.about.title,
})

function AboutPage() {
  return <MarketingAboutPage />
}

export const Route = createFileRoute('/_marketing/about')({
  head: () => createMarketingHead(metadata),
  component: AboutPage,
})
