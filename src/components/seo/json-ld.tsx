import { baseUrl } from '@/lib/baseUrl'
import { websiteContent } from '@/lib/website-content'

type JsonLdValue = Record<string, unknown> | Record<string, unknown>[]

export function JsonLd({ data }: { data: JsonLdValue }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}

const businessId = `${baseUrl}/#business`

export const professionalServiceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': businessId,
  name: websiteContent.site.name,
  alternateName: websiteContent.site.legalName,
  description: websiteContent.site.description,
  url: baseUrl,
  hasMap: websiteContent.site.googleBusinessProfileUrl,
  email: websiteContent.contact.email,
  telephone: `+${websiteContent.contact.phoneHref}`,
  image: new URL(websiteContent.images.profile, baseUrl).toString(),
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Charlevoix',
    addressRegion: 'MI',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 45.3181,
    longitude: -85.2584,
  },
  areaServed: websiteContent.webDesignPage.serviceAreas.map((area) => ({
    '@type': 'AdministrativeArea',
    name: area.name,
  })),
  sameAs: [
    ...websiteContent.socialLinks.map((profile) => profile.href),
    websiteContent.site.googleBusinessProfileUrl,
  ],
  knowsAbout: [
    'Small business website design',
    'Website development',
    'Local search engine optimization',
    'Business automation',
    'Hybrid meeting systems',
  ],
}

const serviceAreas = websiteContent.webDesignPage.serviceAreas.map((area) => ({
  '@type': 'AdministrativeArea',
  name: area.name,
}))

const createServiceJsonLd = ({
  description,
  name,
  pathname,
  price,
  priceUnit,
  serviceType,
}: {
  description: string
  name: string
  pathname: string
  price?: string
  priceUnit?: string
  serviceType: string
}) => [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name,
        item: `${baseUrl}${pathname}`,
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${baseUrl}${pathname}#service`,
    name,
    serviceType,
    description,
    url: `${baseUrl}${pathname}`,
    provider: {
      '@id': businessId,
    },
    areaServed: serviceAreas,
    ...(price
      ? {
          offers: {
            '@type': 'Offer',
            url: `${baseUrl}/contact`,
            ...(priceUnit
              ? {
                  priceSpecification: {
                    '@type': 'UnitPriceSpecification',
                    price,
                    priceCurrency: 'USD',
                    unitText: priceUnit,
                  },
                }
              : { price, priceCurrency: 'USD' }),
          },
        }
      : {}),
  },
]

export const charlevoixWebDesignJsonLd = createServiceJsonLd({
  description: websiteContent.seo.charlevoixWebDesign.description,
  name: 'Charlevoix Web Design',
  pathname: '/web-design-charlevoix',
  price: '2400',
  serviceType: 'Small business website design and development',
})

export const aiBusinessAutomationJsonLd = createServiceJsonLd({
  description: websiteContent.seo.aiBusinessAutomation.description,
  name: 'AI Business Automation in Charlevoix',
  pathname: '/ai-business-automation-charlevoix',
  price: '285',
  priceUnit: 'DAY',
  serviceType: websiteContent.focusedServices.aiAutomation.serviceType,
})

export const hybridMeetingSolutionsJsonLd = createServiceJsonLd({
  description: websiteContent.seo.hybridMeetingSolutions.description,
  name: 'Hybrid Meeting and Zoom Room Solutions',
  pathname: '/hybrid-meeting-solutions-northern-michigan',
  price: '3200',
  serviceType: websiteContent.focusedServices.hybridMeetings.serviceType,
})
