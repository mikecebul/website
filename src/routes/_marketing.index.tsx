import { createFileRoute } from '@tanstack/react-router'
import { createMarketingHead } from '@/lib/marketing-metadata'
import { WebDevelopmentHomePage } from '@/components/marketing/web-development'
import { JsonLd, websitePackageJsonLd } from '@/components/seo/json-ld'
import { createMarketingMetadata } from '@/lib/marketing-metadata'
import { websiteContent } from '@/lib/website-content'

const metadata = createMarketingMetadata({
  description: websiteContent.seo.home.description,
  keywords: websiteContent.seo.home.keywords,
  pathname: '/',
  title: websiteContent.seo.home.title,
})

function HomePage() {
  return (
    <>
      <JsonLd data={websitePackageJsonLd} />
      <WebDevelopmentHomePage />
    </>
  )
}

export const Route = createFileRoute('/_marketing/')({
  component: HomePage,
  head: () => createMarketingHead(metadata),
})
