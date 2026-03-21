import { MarketingContactPage } from '@/components/marketing/marketing-pages'
import { createMarketingMetadata } from '@/lib/marketing-metadata'
import { websiteContent } from '@/lib/website-content'

export const metadata = createMarketingMetadata({
  description: websiteContent.seo.contact.description,
  pathname: '/contact',
  title: websiteContent.seo.contact.title,
})

export default function ContactPage() {
  return <MarketingContactPage />
}
