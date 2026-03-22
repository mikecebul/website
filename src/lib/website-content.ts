import { z } from 'zod'

import rawWebsiteContent from './website-content.json'

const linkSchema = z.object({
  href: z.string(),
  label: z.string(),
})

const metricSchema = z.object({
  label: z.string(),
  value: z.string(),
})

const detailSchema = z.object({
  amount: z.string(),
  label: z.string(),
})

const galleryItemSchema = z.object({
  body: z.string(),
  imageAlt: z.string(),
  imageSrc: z.string(),
  title: z.string(),
})

const seoEntrySchema = z.object({
  description: z.string(),
  keywords: z.array(z.string()).min(1),
  title: z.string(),
})

const websiteContentSchema = z.object({
  site: z.object({
    coordinates: z.string(),
    description: z.string(),
    legalName: z.string(),
    location: z.string(),
    name: z.string(),
    titleSuffix: z.string(),
  }),
  images: z.object({
    dataVisualization: z.string(),
    hero: z.string(),
    office: z.string(),
    profile: z.string(),
  }),
  contact: z.object({
    email: z.string().email(),
    inquiryTypes: z.array(z.string()).min(1),
    location: z.string(),
    phone: z.string(),
    phoneHref: z.string(),
  }),
  socialLinks: z.array(
    z.object({
      href: z.string().url(),
      label: z.string(),
    }),
  ),
  headerNav: z.array(linkSchema),
  footer: z.object({
    companyLinks: z.array(linkSchema),
    description: z.string(),
    servicesLinks: z.array(linkSchema),
  }),
  seo: z.object({
    defaultOgImage: z.string(),
    home: seoEntrySchema,
    services: seoEntrySchema,
    about: seoEntrySchema,
    contact: seoEntrySchema,
    blogIndex: seoEntrySchema,
    caseStudies: z.object({
      hybridMeetingSolutions: seoEntrySchema,
      websites: seoEntrySchema,
    }),
  }),
  home: z.object({
    backgroundBody: z.array(z.string()).min(1),
    backgroundTitle: z.string(),
    body: z.string(),
    eyebrow: z.string(),
    headline: z.string(),
    heroCaptionEyebrow: z.string(),
    heroCaptionTitle: z.string(),
    highlight: z.string(),
  }),
  servicesIntro: z.object({
    body: z.string(),
    eyebrow: z.string(),
    title: z.string(),
  }),
  services: z.array(
    z.object({
      bullets: z.array(z.string()),
      ctaHref: z.string(),
      ctaLabel: z.string(),
      description: z.string(),
      eyebrow: z.string(),
      featured: z.boolean().optional(),
      headline: z.string(),
      price: z.string(),
      priceDetail: detailSchema.optional(),
      priceSuffix: z.string(),
      title: z.string(),
    }),
  ),
  servicePrinciples: z.array(z.object({ body: z.string(), title: z.string() })),
  about: z.object({
    body: z.string(),
    eyebrow: z.string(),
    heading: z.object({
      accentGold: z.string(),
      accentSky: z.string(),
      lineOne: z.string(),
      middle: z.string(),
    }),
    stats: z.array(metricSchema),
  }),
  aboutHighlights: z.array(z.object({ body: z.string(), title: z.string() })),
  processSteps: z.array(
    z.object({
      body: z.string(),
      number: z.string(),
      title: z.string(),
    }),
  ),
  contactPage: z.object({
    detailsTitle: z.string(),
    eyebrow: z.string(),
    formBody: z.string(),
    formTitle: z.string(),
    title: z.string(),
  }),
  blogPage: z.object({
    body: z.string(),
    eyebrow: z.string(),
    newsletterBody: z.string(),
    newsletterEyebrow: z.string(),
    newsletterPlaceholder: z.string(),
    newsletterTitle: z.string(),
    title: z.string(),
  }),
  caseStudies: z.array(
    z.object({
      challenge: z.string(),
      ctaBody: z.string(),
      ctaHeading: z.string(),
      eyebrow: z.string(),
      gallery: z.array(galleryItemSchema),
      intro: z.string(),
      metrics: z.array(metricSchema),
      navDescription: z.string(),
      navTitle: z.string(),
      results: z.array(z.string()),
      role: z.string(),
      slug: z.string(),
      solution: z.string(),
      summary: z.array(z.object({ body: z.string(), title: z.string() })),
      title: z.string(),
    }),
  ),
  cta: z.object({
    body: z.string(),
    buttonHref: z.string(),
    buttonLabel: z.string(),
    eyebrow: z.string(),
    title: z.string(),
  }),
})

export const websiteContent = websiteContentSchema.parse(rawWebsiteContent)

export type WebsiteContent = z.infer<typeof websiteContentSchema>
export type MarketingCaseStudy = WebsiteContent['caseStudies'][number]
export type MarketingService = WebsiteContent['services'][number]

export const websitePaths = {
  about: '/about',
  blog: '/blog',
  caseStudies: {
    hybridMeetingSolutions: '/case-studies/hybrid-meeting-solutions',
    websites: '/case-studies/websites',
  },
  contact: '/contact',
  home: '/',
  services: '/services',
} as const

export const getCaseStudyBySlug = (slug: string) =>
  websiteContent.caseStudies.find((caseStudy) => caseStudy.slug === slug)
