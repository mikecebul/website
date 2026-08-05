import { CharlevoixWebDesignPage } from '@/components/marketing/charlevoix-web-design-page'
import { JsonLd, charlevoixWebDesignJsonLd } from '@/components/seo/json-ld'
import { createMarketingMetadata } from '@/lib/marketing-metadata'
import { websiteContent } from '@/lib/website-content'

export const metadata = createMarketingMetadata({
  description: websiteContent.seo.charlevoixWebDesign.description,
  keywords: websiteContent.seo.charlevoixWebDesign.keywords,
  pathname: '/web-design-charlevoix',
  title: websiteContent.seo.charlevoixWebDesign.title,
})

export default function WebDesignCharlevoixPage() {
  return (
    <>
      <JsonLd data={charlevoixWebDesignJsonLd} />
      <CharlevoixWebDesignPage />
    </>
  )
}
