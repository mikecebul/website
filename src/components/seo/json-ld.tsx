import { baseUrl } from '@/lib/baseUrl'
import { websiteContent } from '@/lib/website-content'
import { getBlogImages, getBlogPostDescription } from '@/lib/blog-seo'
import type { Blog } from '@/payload-types'

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

const serviceAreas = [
  'Charlevoix County',
  'Emmet County',
  'Antrim County',
  'Cheboygan County',
  'Otsego County',
].map((name) => ({
  '@type': 'AdministrativeArea',
  name,
}))

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
    streetAddress: '201 State St, Lower Level',
    addressLocality: 'Charlevoix',
    addressRegion: 'MI',
    postalCode: '49720',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 45.3181,
    longitude: -85.2584,
  },
  areaServed: serviceAreas,
  sameAs: [
    ...websiteContent.socialLinks.map((profile) => profile.href),
    websiteContent.site.googleBusinessProfileUrl,
  ],
  knowsAbout: [
    'Small business website design',
    'Website development',
    'Local search engine optimization',
    'Website management',
    'Google Business Profile setup',
    'Hybrid meeting solutions',
    'Zoom Rooms and audiovisual integration',
  ],
}

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

export const websitePackageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${baseUrl}/websites#website-package`,
  name: 'Simple marketing website development and management',
  serviceType: 'Marketing website development and ongoing management',
  description: `A simple marketing website with a $${websiteContent.websiteOffer.setupPrice} one-time setup fee and $${websiteContent.websiteOffer.monthlyPrice} per month for ongoing management. ${websiteContent.websiteOffer.qualification}`,
  url: `${baseUrl}/websites`,
  provider: { '@id': businessId },
  areaServed: serviceAreas,
}

export const automationServicesJsonLd = createServiceJsonLd({
  description: 'System syncing and email automation for Northern Michigan businesses.',
  name: 'AI Business Automation in Charlevoix',
  pathname: '/services',
  price: '285',
  priceUnit: 'DAY',
  serviceType: 'Business process, system integration, email, and AI automation consulting',
})

export const hybridMeetingServiceJsonLd = createServiceJsonLd({
  description: websiteContent.seo.hybridMeetingSolutions.description,
  name: 'Hybrid Meeting and Zoom Room Solutions',
  pathname: '/hybrid-meeting-solutions',
  price: String(websiteContent.hybridMeetingOffer.setupPrice),
  serviceType: 'Hybrid meeting room, Zoom Rooms, and audiovisual integration consulting',
})

export function createPageJsonLd({
  title,
  description,
  pathname,
}: {
  title: string
  description: string
  pathname: string
}) {
  const url = new URL(pathname, baseUrl).toString()
  const path = new URL(url).pathname
  const pageType =
    path === '/about'
      ? 'AboutPage'
      : path === '/contact'
        ? 'ContactPage'
        : path === '/blog'
          ? 'CollectionPage'
          : 'WebPage'
  const labels: Record<string, string> = {
    '/about': 'About',
    '/contact': 'Contact',
    '/websites': 'Websites',
    '/blog': 'Blog',
    '/hybrid-meeting-solutions': 'Hybrid Meeting Solutions',
  }
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: baseUrl,
      name: websiteContent.site.name,
      publisher: { '@id': businessId },
      inLanguage: 'en-US',
    },
    {
      '@context': 'https://schema.org',
      '@type': pageType,
      '@id': `${url}#webpage`,
      url,
      name: title,
      description,
      isPartOf: { '@id': `${baseUrl}/#website` },
      about: { '@id': businessId },
      inLanguage: 'en-US',
    },
    ...(path !== '/' && !path.startsWith('/blog/') && path !== '/hybrid-meeting-solutions'
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
              { '@type': 'ListItem', position: 2, name: labels[path] || title, item: url },
            ],
          },
        ]
      : []),
  ]
}

export function createBlogPostingJsonLd(post: Blog) {
  const url = new URL(`/blog/${post.slug}`, baseUrl).toString()
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: post.title,
      description: getBlogPostDescription(post),
      url,
      mainEntityOfPage: { '@id': `${url}#webpage` },
      image: getBlogImages(post.content?.root).map((image) =>
        new URL(image.url!, baseUrl).toString(),
      ),
      datePublished: post.firstPublishedAt || post.createdAt,
      dateModified: post.updatedAt,
      author: { '@type': 'Person', name: websiteContent.site.name, url: `${baseUrl}/about` },
      publisher: { '@id': businessId },
      inLanguage: 'en-US',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
  ]
}
