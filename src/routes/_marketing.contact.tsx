import { createFileRoute } from '@tanstack/react-router'
import { createMarketingHead } from '@/lib/marketing-metadata'
import { MarketingContactPage } from '@/components/marketing/marketing-pages'
import { createMarketingMetadata } from '@/lib/marketing-metadata'
import { websiteContent } from '@/lib/website-content'

const metadata = createMarketingMetadata({
  description: websiteContent.seo.contact.description,
  keywords: websiteContent.seo.contact.keywords,
  pathname: '/contact',
  title: websiteContent.seo.contact.title,
})

function ContactPage() {
  return <MarketingContactPage />
}

export const Route = createFileRoute('/_marketing/contact')({
  head: () => createMarketingHead(metadata),
  component: ContactPage,
})
