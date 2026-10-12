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
  const { inquiry } = Route.useSearch()
  return (
    <MarketingContactPage
      initialInquiryType={
        inquiry === 'google-business-profile'
          ? 'Google Business Profile setup'
          : inquiry === 'hybrid-meeting-solutions'
            ? 'Hybrid meeting solutions'
            : inquiry === 'automated-workflows'
              ? 'AI & automated workflows'
              : ''
      }
    />
  )
}

export const Route = createFileRoute('/_marketing/contact')({
  validateSearch: (search: Record<string, unknown>) => ({
    inquiry: typeof search.inquiry === 'string' ? search.inquiry : undefined,
  }),
  head: () => createMarketingHead(metadata),
  component: ContactPage,
})
