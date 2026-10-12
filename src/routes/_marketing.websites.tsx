import { createFileRoute } from '@tanstack/react-router'
import { createMarketingHead } from '@/lib/marketing-metadata'
import { WebDevelopmentWebsitesPage } from '@/components/marketing/web-development'
import { websitePackageJsonLd, JsonLd } from '@/components/seo/json-ld'
import { createMarketingMetadata } from '@/lib/marketing-metadata'
import { websiteContent } from '@/lib/website-content'

const metadata = createMarketingMetadata({
  ...websiteContent.seo.websites,
  pathname: '/websites',
})

function WebsitesPage() {
  return (
    <>
      <JsonLd data={websitePackageJsonLd} />
      <WebDevelopmentWebsitesPage />
    </>
  )
}

export const Route = createFileRoute('/_marketing/websites')({
  component: WebsitesPage,
  head: () => createMarketingHead(metadata),
})
