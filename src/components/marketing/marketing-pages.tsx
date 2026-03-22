'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ArrowRight,
  Check,
  Globe,
  Linkedin,
  MapPin,
  Menu,
  Notebook,
  Phone,
  Sparkles,
  Video,
  X,
  Zap,
} from 'lucide-react'
import { motion } from 'motion/react'
import { useState, type ReactNode } from 'react'

import { MarketingContactForm } from '@/components/marketing/contact-form'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { DrawerDescription } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { websiteContent, type MarketingCaseStudy } from '@/lib/website-content'

const navHighlightTransition = {
  damping: 34,
  mass: 0.9,
  stiffness: 460,
  type: 'spring',
} as const

const serviceIconMap = {
  'AI & automation consulting': Sparkles,
  'Business websites': Globe,
  'Hybrid meeting solutions': Video,
} as const

const socialIconMap = {
  LinkedIn: Linkedin,
  X,
} as const

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh bg-[radial-gradient(circle_at_top,rgba(123,208,255,0.16),transparent_0_24%),linear-gradient(180deg,#0b1326_0%,#08101f_48%,#0b1326_100%)] text-(--marketing-heading)">
      <MarketingNav />
      {children}
      <MarketingFooter />
    </div>
  )
}

export function MarketingHomePage() {
  return (
    <MarketingPageMain>
      <section className="mx-auto grid max-w-[1220px] gap-8 px-4 pt-6 sm:px-6 lg:grid-cols-[minmax(0,1.16fr)_minmax(320px,0.84fr)] lg:items-center lg:px-12">
        <div className="flex flex-col gap-6">
          <MarketingEyebrow>{websiteContent.home.eyebrow}</MarketingEyebrow>
          <div className="max-w-[46rem] space-y-5">
            <h1 className="max-w-[10.5ch] font-heading text-5xl font-semibold tracking-tighter text-balance sm:text-[4.35rem] lg:text-[5.6rem]">
              Elevate Your{' '}
              <span className="text-(--marketing-gold)">{websiteContent.home.highlight}</span> with
              Modern Tech.
            </h1>
            <p className="max-w-xl text-base leading-7 text-(--marketing-copy) sm:text-lg">
              {websiteContent.home.body}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <MarketingButtonLink href="/contact">Start a Project</MarketingButtonLink>
            <MarketingButtonLink href="/services" tone="secondary">
              View Services
            </MarketingButtonLink>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[32px] border border-white/8 bg-(--marketing-panel) p-3 shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,236,185,0.16),transparent_38%)]" />
          <div className="relative overflow-hidden rounded-[24px]">
            <Image
              alt="Charlevoix lighthouse at dusk"
              className="h-[420px] w-full object-cover"
              src={websiteContent.images.hero}
              loading="eager"
              width={1600}
              height={1200}
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,19,38,0.04),rgba(11,19,38,0.56)_72%,rgba(11,19,38,0.8))]" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <div className="max-w-sm rounded-[24px] border border-white/10 bg-[rgba(9,16,31,0.6)] px-5 py-4 backdrop-blur-md">
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-(--marketing-sky)">
                  {websiteContent.home.heroCaptionEyebrow}
                </p>
                <p className="mt-2 font-heading text-xl tracking-[-0.04em] text-(--marketing-heading)">
                  {websiteContent.home.heroCaptionTitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 grid max-w-[1220px] gap-10 bg-[rgba(19,27,46,0.72)] px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.1fr] lg:px-12">
        <div className="space-y-3">
          <MarketingEyebrow>Background</MarketingEyebrow>
          <h2 className="max-w-md font-heading text-3xl tracking-[-0.06em] sm:text-4xl">
            {websiteContent.home.backgroundTitle}
          </h2>
        </div>
        <div className="space-y-5 text-base leading-8 text-(--marketing-copy)">
          {websiteContent.home.backgroundBody.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <MarketingInlineLink href="/about">Learn more about the journey</MarketingInlineLink>
        </div>
      </section>

      <MarketingServicesOverview />
      <MarketingLocalRootsSection />
      <MarketingCtaSection />
    </MarketingPageMain>
  )
}

export function MarketingServicesPage() {
  return (
    <MarketingPageMain>
      <MarketingServicesHero />
      <MarketingServicesOverview />

      <section className="mx-auto mt-20 grid max-w-[1220px] gap-6 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-12">
        <div className="rounded-[32px] border border-white/8 bg-(--marketing-panel) p-8 shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
          <MarketingEyebrow>Engagement style</MarketingEyebrow>
          <h2 className="mt-3 font-heading text-3xl tracking-[-0.05em]">
            A flexible model for scoped builds and longer-term support.
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-7 text-(--marketing-copy)">
            <p>
              Some projects start with a fast diagnostic and recommendation sprint. Others move
              straight into implementation and ongoing refinement. The structure depends on how much
              clarity already exists.
            </p>
            <p>
              The goal is always the same: reduce friction, improve confidence, and leave you with a
              system that feels easier to operate.
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {websiteContent.servicePrinciples.map((principle) => (
            <Card
              key={principle.title}
              className="rounded-[28px] border border-white/8 bg-[rgba(19,27,46,0.9)] py-0 text-(--marketing-heading) ring-0"
            >
              <CardHeader className="gap-3 px-6 pt-6">
                <CardTitle className="text-xl">{principle.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6 text-sm leading-7 text-(--marketing-copy)">
                {principle.body}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-[1220px] px-4 sm:px-6 lg:px-12">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {websiteContent.processSteps.map((step) => (
            <div
              key={step.number}
              className="rounded-[28px] border border-white/8 bg-[rgba(19,27,46,0.78)] p-6"
            >
              <p className="text-sm uppercase tracking-[0.28em] text-(--marketing-gold)">
                {step.number}
              </p>
              <h3 className="mt-4 font-heading text-2xl tracking-[-0.04em]">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-(--marketing-copy)">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <MarketingCtaSection />
    </MarketingPageMain>
  )
}

export function MarketingAboutPage() {
  return (
    <MarketingPageMain>
      <section className="mx-auto grid max-w-[1220px] gap-8 px-4 pt-6 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.9fr)] lg:items-start lg:px-12">
        <div className="space-y-5">
          <MarketingEyebrow>{websiteContent.about.eyebrow}</MarketingEyebrow>
          <h1 className="max-w-5xl font-heading text-5xl leading-[0.9] tracking-[-0.08em] sm:text-6xl lg:text-[5.2rem]">
            <span className="block">{websiteContent.about.heading.lineOne}</span>
            <span className="block">
              <span className="text-[#ffcd1f]">{websiteContent.about.heading.accentGold}</span>{' '}
              {websiteContent.about.heading.middle}{' '}
              <span className="text-(--marketing-sky)">
                {websiteContent.about.heading.accentSky}
              </span>
            </span>
          </h1>
          <p className="max-w-2xl text-base leading-8 text-(--marketing-copy) sm:text-lg">
            {websiteContent.about.body}
          </p>
        </div>

        <div className="rounded-[32px] border border-white/8 bg-[linear-gradient(180deg,rgba(19,27,46,0.96),rgba(9,16,31,0.96))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
          <Image
            alt="Mike Cebulski portrait"
            className="h-[360px] w-full rounded-[24px] object-cover object-top"
            src={websiteContent.images.profile}
            width={900}
            height={1200}
            sizes="(min-width: 1024px) 38vw, 100vw"
          />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {websiteContent.about.stats.map((stat) => (
              <MarketingStatCard key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-[1220px] px-4 sm:px-6 lg:px-12">
        <div className="grid gap-4 lg:grid-cols-3">
          {websiteContent.aboutHighlights.map((highlight, index) => (
            <Card
              key={highlight.title}
              className={cn(
                'rounded-[28px] border border-white/8 bg-[rgba(19,27,46,0.82)] py-0 text-(--marketing-heading) ring-0',
                index === 1 && 'bg-[rgba(34,42,61,0.95)]',
              )}
            >
              <CardHeader className="px-6 pt-6">
                <CardTitle className="text-xl">{highlight.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6 text-sm leading-7 text-(--marketing-copy)">
                {highlight.body}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 grid max-w-[1220px] gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-12">
        <div className="overflow-hidden rounded-[32px] border border-white/8 bg-(--marketing-panel)">
          <Image
            alt="Glowing technical data visualization"
            className="h-full min-h-[420px] w-full object-cover"
            src={websiteContent.images.dataVisualization}
            width={1600}
            height={1200}
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
        <div className="flex flex-col justify-center gap-6">
          <MarketingEyebrow>Why work with a specialist?</MarketingEyebrow>
          <h2 className="font-heading text-3xl tracking-[-0.05em] sm:text-4xl">
            Technical depth without the distance.
          </h2>
          <p className="text-base leading-8 text-(--marketing-copy)">
            I like systems that are both convincing and calm. That usually means less noise, better
            structure, and a stronger relationship between design decisions and business outcomes.
          </p>
          <div className="grid gap-4">
            <MarketingChecklistItem>
              Thoughtful execution across interface, infrastructure, and room experience.
            </MarketingChecklistItem>
            <MarketingChecklistItem>
              A local point of contact who understands context as well as craft.
            </MarketingChecklistItem>
            <MarketingChecklistItem>
              Deliverables that feel polished without becoming hard to maintain.
            </MarketingChecklistItem>
          </div>
        </div>
      </section>

      <MarketingCtaSection />
    </MarketingPageMain>
  )
}

export function MarketingContactPage() {
  return (
    <MarketingPageMain>
      <section className="mx-auto max-w-[1220px] px-4 pt-6 sm:px-6 lg:px-12">
        <MarketingEyebrow>{websiteContent.contactPage.eyebrow}</MarketingEyebrow>
        <h1 className="mt-3 max-w-4xl font-heading text-5xl leading-[0.94] tracking-[-0.07em] sm:text-6xl">
          {websiteContent.contactPage.title}
        </h1>
      </section>

      <section className="mx-auto mt-16 grid max-w-[1220px] gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(320px,0.82fr)_minmax(0,1.18fr)] lg:px-12">
        <div className="order-2 flex flex-col gap-8 lg:order-1">
          <div className="rounded-[32px] border border-white/8 bg-[rgba(19,27,46,0.85)] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
            <h2 className="font-heading text-3xl tracking-[-0.05em]">
              {websiteContent.contactPage.detailsTitle}
            </h2>
            <div className="mt-6 flex flex-col gap-5 text-sm leading-7 text-(--marketing-copy)">
              <ContactInfoItem
                label="Location"
                value={websiteContent.contact.location}
                icon={<MapPin className="size-5" />}
              />
              <ContactInfoItem
                label="Email"
                value={
                  <a
                    className="transition-colors hover:text-(--marketing-heading)"
                    href={`mailto:${websiteContent.contact.email}`}
                  >
                    {websiteContent.contact.email}
                  </a>
                }
                icon={<Notebook className="size-5" />}
              />
              <ContactInfoItem
                label="Phone"
                value={
                  <a
                    className="transition-colors hover:text-(--marketing-heading)"
                    href={`tel:${websiteContent.contact.phoneHref}`}
                  >
                    {websiteContent.contact.phone}
                  </a>
                }
                icon={<Phone className="size-5" />}
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-white/8 bg-[rgba(19,27,46,0.85)]">
            <Image
              alt="Charlevoix harbor at dusk"
              className="h-[280px] w-full object-cover"
              src={websiteContent.images.hero}
              width={1600}
              height={1200}
              sizes="(min-width: 1024px) 30vw, 100vw"
            />
            <div className="border-t border-white/8 px-6 py-5">
              <p className="text-sm uppercase tracking-[0.28em] text-(--marketing-gold)">
                Location
              </p>
              <p className="mt-2 text-base text-(--marketing-copy)">
                {websiteContent.contact.location}
              </p>
            </div>
          </div>
        </div>

        <div className="order-1 rounded-[36px] border border-white/8 bg-[linear-gradient(180deg,rgba(19,27,46,0.98),rgba(12,18,33,0.98))] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.34)] sm:p-10 lg:order-2">
          <div className="mb-8">
            <h2 className="font-heading text-3xl tracking-[-0.05em]">
              {websiteContent.contactPage.formTitle}
            </h2>
          </div>
          <MarketingContactForm />
        </div>
      </section>
    </MarketingPageMain>
  )
}

export function MarketingCaseStudyPage({ caseStudy }: { caseStudy: MarketingCaseStudy }) {
  return (
    <MarketingPageMain>
      <section className="mx-auto max-w-[1220px] px-4 pt-6 sm:px-6 lg:px-12">
        <MarketingEyebrow>{caseStudy.eyebrow}</MarketingEyebrow>
        <h1 className="mt-3 max-w-5xl font-heading text-5xl leading-[0.94] tracking-[-0.07em] sm:text-6xl">
          {caseStudy.title}
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-(--marketing-copy) sm:text-lg">
          {caseStudy.intro}
        </p>
      </section>

      <section className="mx-auto mt-16 grid max-w-[1220px] gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)] lg:px-12">
        <div className="overflow-hidden rounded-[36px] border border-white/8 bg-[rgba(19,27,46,0.85)] shadow-[0_28px_80px_rgba(0,0,0,0.3)]">
          <Image
            alt={caseStudy.gallery[0]?.imageAlt || caseStudy.title}
            className="h-[420px] w-full object-cover"
            src={caseStudy.gallery[0]?.imageSrc}
            width={1600}
            height={1200}
            sizes="(min-width: 1024px) 60vw, 100vw"
          />
        </div>
        <div className="grid gap-4">
          {caseStudy.metrics.map((metric) => (
            <MarketingStatCard key={metric.label} label={metric.label} value={metric.value} />
          ))}
          <div className="rounded-[28px] border border-white/8 bg-[rgba(19,27,46,0.8)] p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-(--marketing-copy-soft)">Role</p>
            <p className="mt-3 text-sm leading-7 text-(--marketing-copy)">{caseStudy.role}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 grid max-w-[1220px] gap-4 px-4 sm:px-6 md:grid-cols-3 lg:px-12">
        {caseStudy.summary.map((item) => (
          <Card
            key={item.title}
            className="rounded-[28px] border border-white/8 bg-[rgba(19,27,46,0.84)] py-0 text-(--marketing-heading) ring-0"
          >
            <CardHeader className="px-6 pt-6">
              <CardTitle className="text-xl">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 text-sm leading-7 text-(--marketing-copy)">
              {item.body}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mx-auto mt-20 grid max-w-[1220px] gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:px-12">
        <div className="space-y-6">
          <div className="rounded-[32px] border border-white/8 bg-[rgba(19,27,46,0.82)] p-8">
            <MarketingEyebrow>Challenge</MarketingEyebrow>
            <p className="mt-4 text-base leading-8 text-(--marketing-copy)">
              {caseStudy.challenge}
            </p>
          </div>
          <div className="rounded-[32px] border border-white/8 bg-[rgba(34,42,61,0.92)] p-8">
            <MarketingEyebrow>Solution</MarketingEyebrow>
            <p className="mt-4 text-base leading-8 text-(--marketing-copy)">{caseStudy.solution}</p>
          </div>
        </div>
        <div className="rounded-[32px] border border-white/8 bg-[rgba(19,27,46,0.82)] p-8">
          <MarketingEyebrow>Results</MarketingEyebrow>
          <div className="mt-6 grid gap-4">
            {caseStudy.results.map((result) => (
              <MarketingChecklistItem key={result}>{result}</MarketingChecklistItem>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-[1220px] px-4 sm:px-6 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-3">
          {caseStudy.gallery.map((item) => (
            <article
              key={item.title}
              className="overflow-hidden rounded-[30px] border border-white/8 bg-[rgba(19,27,46,0.84)]"
            >
              <Image
                alt={item.imageAlt}
                className="h-56 w-full object-cover"
                src={item.imageSrc}
                width={1200}
                height={900}
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              />
              <div className="p-6">
                <h3 className="font-heading text-2xl tracking-[-0.04em]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-(--marketing-copy)">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-[1024px] px-4 sm:px-6 lg:px-12">
        <div className="rounded-[34px] border border-white/8 bg-[linear-gradient(155deg,rgba(34,42,61,1),rgba(19,27,46,1))] px-8 py-12 text-center shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:px-12">
          <MarketingEyebrow>Next step</MarketingEyebrow>
          <h2 className="mt-3 font-heading text-3xl tracking-[-0.05em] sm:text-4xl">
            {caseStudy.ctaHeading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-(--marketing-copy)">
            {caseStudy.ctaBody}
          </p>
          <div className="mt-8">
            <MarketingButtonLink href="/contact">Start a Conversation</MarketingButtonLink>
          </div>
        </div>
      </section>
    </MarketingPageMain>
  )
}

export function MarketingBlogIntro() {
  return (
    <>
      <MarketingPageHero
        eyebrow={websiteContent.blogPage.eyebrow}
        title={websiteContent.blogPage.title}
        body={websiteContent.blogPage.body}
      />
      <div className="mx-auto mt-8 flex max-w-[1220px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-12">
        <div className="text-sm text-(--marketing-copy)">
          Payload-powered writing with the same marketing system wrapped around it.
        </div>
      </div>
    </>
  )
}

export function MarketingBlogNewsletterCard() {
  return (
    <div className="rounded-[28px] border border-(--marketing-gold)/30 bg-(--marketing-gold) px-6 py-7 text-(--marketing-gold-foreground)">
      <p className="text-sm uppercase tracking-[0.28em] opacity-70">
        {websiteContent.blogPage.newsletterEyebrow}
      </p>
      <h3 className="mt-3 font-heading text-2xl tracking-[-0.04em]">
        {websiteContent.blogPage.newsletterTitle}
      </h3>
      <p className="mt-3 text-sm leading-7 opacity-80">{websiteContent.blogPage.newsletterBody}</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Input
          aria-label="Email address"
          className="h-12 rounded-full border-[rgba(60,47,0,0.16)] bg-white/50 px-4 text-(--marketing-gold-foreground) placeholder:text-[rgba(60,47,0,0.55)]"
          placeholder={websiteContent.blogPage.newsletterPlaceholder}
        />
        <Button className="h-12 rounded-full bg-(--marketing-ink) px-5 text-(--marketing-gold) hover:bg-(--marketing-ink)/90">
          Subscribe
        </Button>
      </div>
    </div>
  )
}

function MarketingPageMain({ children }: { children: ReactNode }) {
  return <main className="pt-8 pb-24 sm:pt-10 lg:pt-14 lg:pb-32">{children}</main>
}

function MarketingServicesOverview() {
  return (
    <section id="service-offerings" className="mx-auto mt-20 max-w-[1220px] px-4 sm:px-6 lg:px-12">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <MarketingEyebrow>Core Services</MarketingEyebrow>
          <h2 className="max-w-4xl font-heading text-3xl tracking-[-0.05em] sm:text-4xl">
            Services designed for real business needs.
          </h2>
        </div>
      </div>

      <div className="mt-16 grid gap-6 lg:grid-cols-3 lg:items-stretch">
        {websiteContent.services.map((service) => {
          const Icon = getServiceIcon(service.headline)

          return (
            <article
              key={service.headline}
              className={cn(
                'relative flex min-h-[640px] flex-col overflow-visible rounded-[34px] border border-white/8 bg-[linear-gradient(180deg,rgba(21,29,48,0.96),rgba(18,25,42,0.98))] px-8 py-7 shadow-[0_24px_70px_rgba(0,0,0,0.28)]',
                service.featured &&
                  'border-(--marketing-gold)/80 bg-[linear-gradient(180deg,rgba(43,52,75,0.98),rgba(24,31,49,0.98))] shadow-[0_28px_90px_rgba(0,0,0,0.34)] lg:-my-3',
              )}
            >
              {service.featured ? (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(60,47,0,0.12)] bg-(--marketing-gold) px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-(--marketing-gold-foreground) shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
                  Most Popular
                </div>
              ) : null}

              <div
                className={cn(
                  'grid grid-cols-[auto_minmax(0,1fr)] items-start gap-5',
                  service.featured && 'pt-8',
                )}
              >
                <div className="flex size-20 items-center justify-center rounded-[24px] bg-[rgba(53,61,86,0.7)] text-(--marketing-gold) shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <Icon className="size-6" />
                </div>
                <div className="min-w-0 pt-1 text-right">
                  <p className="text-sm uppercase tracking-[0.18em] text-(--marketing-sky) sm:text-base">
                    {service.eyebrow}
                  </p>
                  <div className="mt-3 flex items-end justify-end gap-2">
                    <span className="font-heading text-4xl leading-none tracking-[-0.06em] text-(--marketing-gold) sm:text-5xl">
                      {service.price}
                    </span>
                    <span className="pb-1 text-base text-(--marketing-copy)">
                      {service.priceSuffix}
                    </span>
                  </div>
                  {service.priceDetail ? (
                    <div className="mt-1.5 inline-flex self-end rounded-[14px] px-1 text-right">
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-[0.95rem] leading-none whitespace-nowrap text-(--marketing-copy)">
                          {service.priceDetail.amount}
                        </span>
                        <span className="text-[0.82rem] leading-none whitespace-nowrap tracking-[0.01em] text-(--marketing-copy)/82">
                          {service.priceDetail.label}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-14 flex flex-1 flex-col">
                <h3 className="max-w-[13.5ch] font-heading text-[2.1rem] leading-[1.06] tracking-[-0.06em] text-balance sm:text-[2.45rem]">
                  {service.headline}
                </h3>
                <p className="mt-6 text-lg leading-8 text-(--marketing-copy)">{service.title}</p>
                <p className="mt-4 text-base leading-8 text-(--marketing-copy)/92">
                  {service.description}
                </p>

                <ul className="mt-10 flex flex-1 flex-col gap-5 text-[1.02rem] text-(--marketing-heading)">
                  {service.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-4">
                      <span className="flex size-6 items-center justify-center rounded-full bg-[#ffcd1f] text-[#1b2340] shadow-[0_0_0_3px_rgba(255,205,31,0.12)]">
                        <Check className="size-3.5 stroke-3" />
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <MarketingButtonLink
                className="mt-10 h-16 w-full justify-center rounded-[22px] border-transparent bg-[rgba(53,61,86,0.92)] px-6 text-base font-semibold text-(--marketing-gold) shadow-none hover:bg-[rgba(64,73,102,0.98)]"
                href={service.ctaHref}
                showIcon={false}
                tone="secondary"
              >
                {service.ctaLabel}
              </MarketingButtonLink>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function MarketingServicesHero() {
  return (
    <section className="mx-auto grid max-w-[1220px] gap-8 px-4 pt-6 sm:px-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(320px,0.98fr)] lg:items-start lg:px-12">
      <div className="space-y-6">
        <MarketingEyebrow>{websiteContent.servicesIntro.eyebrow}</MarketingEyebrow>
        <h1 className="max-w-[11ch] font-heading text-5xl leading-[0.92] tracking-[-0.07em] text-balance sm:text-6xl">
          Clear systems.
          <span className="block text-(--marketing-gold)">Local support.</span>
        </h1>
        <p className="max-w-2xl text-base leading-8 text-(--marketing-copy) sm:text-lg">
          {websiteContent.servicesIntro.body}
        </p>
        <div className="flex flex-wrap gap-3">
          <MarketingButtonLink href="/contact" showIcon={false}>
            Start a Project
          </MarketingButtonLink>
          <MarketingButtonLink href="#service-offerings" showIcon={false} tone="secondary">
            View Services
          </MarketingButtonLink>
        </div>
      </div>

      <div className="rounded-[32px] border border-white/8 bg-[rgba(19,27,46,0.84)] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.3)] sm:p-7">
        <div className="grid gap-4">
          {websiteContent.services.map((service) => {
            const Icon = getServiceIcon(service.headline)

            return (
              <div
                key={service.headline}
                className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 rounded-[24px] border border-white/8 bg-[rgba(11,19,38,0.44)] px-5 py-5"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-[rgba(53,61,86,0.72)] text-(--marketing-gold)">
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.22em] text-(--marketing-sky)">
                    {service.eyebrow}
                  </p>
                  <h2 className="mt-2 font-heading text-2xl tracking-[-0.04em]">
                    {service.headline}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-(--marketing-copy)">
                    {service.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function MarketingLocalRootsSection() {
  return (
    <section className="mx-auto mt-20 grid max-w-[1220px] gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(320px,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:px-12">
      <div className="overflow-hidden rounded-[32px] border border-white/8 bg-(--marketing-panel)">
        <Image
          alt="Charlevoix harbor view"
          className="h-[320px] w-full object-cover"
          src={websiteContent.images.hero}
          width={1600}
          height={1200}
          sizes="(min-width: 1024px) 45vw, 100vw"
        />
      </div>
      <div className="space-y-5">
        <MarketingEyebrow>Community</MarketingEyebrow>
        <h2 className="font-heading text-3xl tracking-[-0.05em] sm:text-4xl">
          Local Roots, Global Impact.
        </h2>
        <p className="max-w-2xl text-base leading-8 text-(--marketing-copy)">
          Being based in Charlevoix isn&apos;t just about the scenery. It&apos;s about the values of
          a tight-knit community: accountability, personal follow-through, and work that still
          matters after the presentation is over.
        </p>
        <div className="rounded-[20px] border border-white/8 bg-[rgba(19,27,46,0.82)] px-5 py-4">
          <p className="font-heading text-xl">{websiteContent.site.location}</p>
          <p className="mt-1 text-sm text-(--marketing-copy)">{websiteContent.site.coordinates}</p>
        </div>
      </div>
    </section>
  )
}

function MarketingPageHero({
  body,
  eyebrow,
  title,
}: {
  body: string
  eyebrow: string
  title: string
}) {
  return (
    <section className="mx-auto max-w-[1220px] px-4 pt-6 sm:px-6 lg:px-12">
      <MarketingEyebrow>{eyebrow}</MarketingEyebrow>
      <h1 className="mt-3 max-w-5xl font-heading text-5xl leading-[0.94] tracking-[-0.07em] sm:text-6xl">
        {title}
      </h1>
      <p className="mt-6 max-w-3xl text-base leading-8 text-(--marketing-copy) sm:text-lg">
        {body}
      </p>
    </section>
  )
}

function MarketingCtaSection() {
  return (
    <section className="mx-auto mt-20 max-w-[1024px] px-4 sm:px-6 lg:px-12">
      <div className="rounded-[34px] border border-white/8 bg-[linear-gradient(155deg,rgba(34,42,61,1),rgba(19,27,46,1))] px-8 py-12 text-center shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:px-12">
        <MarketingEyebrow>{websiteContent.cta.eyebrow}</MarketingEyebrow>
        <h2 className="mt-3 font-heading text-3xl tracking-[-0.05em] sm:text-4xl">
          {websiteContent.cta.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-(--marketing-copy)">
          {websiteContent.cta.body}
        </p>
        <div className="mt-8 flex justify-center">
          <MarketingButtonLink href={websiteContent.cta.buttonHref}>
            {websiteContent.cta.buttonLabel}
          </MarketingButtonLink>
        </div>
      </div>
    </section>
  )
}

function MarketingNav() {
  const pathname = usePathname()
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const isCaseStudyRoute = pathname.startsWith('/case-studies')

  return (
    <header className="sticky top-0 z-20 border-b border-white/6 bg-[rgba(11,19,38,0.76)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-12">
        <Link className="font-heading text-xl tracking-[-0.06em] text-(--marketing-gold)" href="/">
          {websiteContent.site.name}
        </Link>

        <nav className="hidden flex-wrap items-center justify-center gap-2 text-sm text-(--marketing-copy) md:flex">
          {websiteContent.headerNav.map((item) => (
            <MarketingRouteLink
              key={item.href}
              active={pathname === item.href}
              href={item.href}
              label={item.label}
            />
          ))}
          <NavigationMenu
            align="center"
            className="flex-none"
            key={pathname}
            onValueChange={(value, eventDetails) => {
              if (eventDetails.reason === 'trigger-press') {
                return
              }

              setOpenMenu(value ?? null)
            }}
            value={openMenu}
          >
            <NavigationMenuList>
              <NavigationMenuItem value="case-studies">
                <NavigationMenuTrigger
                  className={cn(
                    'relative overflow-hidden rounded-full border-none bg-transparent px-3 py-2 text-(--marketing-copy) shadow-none hover:bg-transparent hover:text-(--marketing-heading) focus:bg-transparent focus:text-(--marketing-heading) focus-visible:ring-0 data-popup-open:bg-transparent data-popup-open:text-(--marketing-heading) data-popup-open:hover:bg-transparent data-popup-open:hover:text-(--marketing-heading) data-open:bg-transparent data-open:text-(--marketing-heading) data-open:hover:bg-transparent data-open:hover:text-(--marketing-heading)',
                    isCaseStudyRoute &&
                      'text-(--marketing-gold) hover:text-(--marketing-gold) data-popup-open:text-(--marketing-gold) data-popup-open:hover:text-(--marketing-gold) data-open:text-(--marketing-gold) data-open:hover:text-(--marketing-gold)',
                  )}
                >
                  {isCaseStudyRoute ? <MarketingNavHighlight /> : null}
                  <span className="relative z-10">Case Studies</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="w-[360px] p-0">
                  <div className="grid gap-1 rounded-[24px] border border-white/10 bg-(--marketing-panel) p-2 text-(--marketing-heading) shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
                    {websiteContent.caseStudies.map((caseStudy) => {
                      const href = `/case-studies/${caseStudy.slug}`
                      const isActiveCaseStudy = pathname === href
                      const CaseStudyIcon = caseStudy.slug === 'websites' ? Globe : Video

                      return (
                        <Link
                          key={caseStudy.slug}
                          className={cn(
                            'group rounded-[18px] border border-transparent px-4 py-3 transition-all hover:border-white/10 hover:bg-white/3',
                            isActiveCaseStudy &&
                              'border-(--marketing-gold)/35 bg-[linear-gradient(180deg,rgba(255,236,185,0.08),rgba(255,236,185,0.03))] shadow-[inset_0_1px_0_rgba(255,236,185,0.08)]',
                          )}
                          href={href}
                          onClick={() => setOpenMenu(null)}
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className={cn(
                                'mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[rgba(53,61,86,0.7)] text-(--marketing-gold)',
                                isActiveCaseStudy &&
                                  'bg-[rgba(255,236,185,0.1)] ring-1 ring-(--marketing-gold)/20',
                              )}
                            >
                              <CaseStudyIcon className="size-5" />
                            </span>
                            <div className="min-w-0">
                              <p className="text-[11px] uppercase tracking-[0.2em] text-(--marketing-sky)">
                                {caseStudy.eyebrow}
                              </p>
                              <p
                                className={cn(
                                  'mt-1 text-sm font-medium text-(--marketing-heading)',
                                  isActiveCaseStudy && 'text-(--marketing-gold)',
                                )}
                              >
                                {caseStudy.navTitle}
                              </p>
                              <p className="mt-1 text-xs leading-5 text-(--marketing-copy)">
                                {caseStudy.navDescription}
                              </p>
                            </div>
                            <ArrowRight
                              className={cn(
                                'mt-1 size-4 shrink-0 text-(--marketing-gold) opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100',
                                isActiveCaseStudy && 'opacity-100',
                              )}
                            />
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="flex items-center gap-3">
          <MarketingButtonLink className="hidden sm:inline-flex" href="/contact">
            Book Consultation
          </MarketingButtonLink>
          <MarketingMobileNav />
        </div>
      </div>
    </header>
  )
}

function MarketingMobileNav() {
  const pathname = usePathname()

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-(--marketing-heading) transition-colors hover:bg-white/10 md:hidden"
        >
          <Menu className="size-5" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="h-full w-[24rem] border-l border-white/10 bg-[rgba(7,16,31,0.98)] text-(--marketing-heading) sm:max-w-none">
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
          <div>
            <DrawerTitle className="font-heading text-xl tracking-[-0.05em] text-(--marketing-gold)">
              {websiteContent.site.name}
            </DrawerTitle>
            <DrawerDescription className="sr-only">
              Main navigation with links to core pages and case studies.
            </DrawerDescription>
          </div>
          <DrawerClose asChild>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-(--marketing-heading) transition-colors hover:bg-white/10"
            >
              <X className="size-5" />
            </button>
          </DrawerClose>
        </div>

        <div className="flex h-full flex-col gap-10 overflow-y-auto px-6 py-8">
          <nav className="flex flex-col gap-3">
            {websiteContent.headerNav.map((item) => (
              <DrawerClose key={item.href} asChild>
                <Link
                  href={item.href}
                  className={cn(
                    'rounded-[20px] border border-white/8 px-5 py-4 font-heading text-2xl tracking-[-0.04em] text-(--marketing-copy) transition-colors hover:text-(--marketing-heading)',
                    pathname === item.href &&
                      'border-(--marketing-gold)/30 bg-white/4 text-(--marketing-gold)',
                  )}
                >
                  {item.label}
                </Link>
              </DrawerClose>
            ))}
          </nav>

          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.28em] text-(--marketing-sky)">
              Case Studies
            </p>
            <div className="grid gap-3">
              {websiteContent.caseStudies.map((caseStudy) => {
                const href = `/case-studies/${caseStudy.slug}`

                return (
                  <DrawerClose key={caseStudy.slug} asChild>
                    <Link
                      href={href}
                      className={cn(
                        'rounded-[24px] border border-white/8 bg-[rgba(19,27,46,0.78)] px-5 py-4 transition-colors hover:bg-[rgba(24,34,58,0.9)]',
                        pathname === href && 'border-(--marketing-gold)/30 bg-[rgba(34,42,61,0.9)]',
                      )}
                    >
                      <p className="text-sm uppercase tracking-[0.2em] text-(--marketing-sky)">
                        {caseStudy.eyebrow}
                      </p>
                      <p className="mt-2 font-heading text-xl tracking-[-0.04em] text-(--marketing-heading)">
                        {caseStudy.navTitle}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-(--marketing-copy)">
                        {caseStudy.navDescription}
                      </p>
                    </Link>
                  </DrawerClose>
                )
              })}
            </div>
          </div>

          <div className="mt-auto rounded-[28px] border border-white/8 bg-[rgba(19,27,46,0.84)] p-5">
            <p className="text-sm uppercase tracking-[0.22em] text-(--marketing-gold)">Contact</p>
            <p className="mt-3 text-base text-(--marketing-copy)">{websiteContent.contact.email}</p>
            <p className="mt-1 text-base text-(--marketing-copy)">{websiteContent.contact.phone}</p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function MarketingRouteLink({
  active,
  href,
  label,
}: {
  active: boolean
  href: string
  label: string
}) {
  return (
    <Link
      className={cn(
        'relative overflow-hidden rounded-full px-3 py-2 transition-colors hover:text-(--marketing-heading)',
        active && 'text-(--marketing-gold)',
      )}
      href={href}
    >
      {active ? <MarketingNavHighlight /> : null}
      <span className="relative z-10">{label}</span>
    </Link>
  )
}

function MarketingNavHighlight() {
  return (
    <motion.span
      layoutId="marketing-nav-highlight"
      className="absolute inset-0 rounded-full border border-(--marketing-gold)/20 bg-white/6 shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
      initial={false}
      transition={navHighlightTransition}
    />
  )
}

function MarketingButtonLink({
  children,
  className,
  href,
  showIcon = true,
  tone = 'primary',
}: {
  children: ReactNode
  className?: string
  href: string
  showIcon?: boolean
  tone?: 'primary' | 'secondary'
}) {
  const variant = tone === 'primary' ? 'default' : 'secondary'
  const themeClassName =
    tone === 'primary'
      ? '[--primary:var(--marketing-gold)] [--primary-foreground:var(--marketing-gold-foreground)]'
      : '[--secondary:var(--marketing-panel-strong)] [--secondary-foreground:var(--marketing-gold)]'

  return (
    <div className={themeClassName}>
      <Link
        className={cn(
          buttonVariants({ size: 'lg', variant }),
          'h-12 rounded-full border border-white/8 px-5 text-sm font-semibold shadow-[0_12px_32px_rgba(0,0,0,0.2)]',
          className,
        )}
        href={href}
      >
        {children}
        {showIcon ? <ArrowRight data-icon="inline-end" /> : null}
      </Link>
    </div>
  )
}

function MarketingInlineLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <Link
      className="inline-flex items-center gap-2 text-sm font-semibold text-(--marketing-gold) transition-transform hover:translate-x-1"
      href={href}
    >
      {children}
      <ArrowRight className="size-4" />
    </Link>
  )
}

function MarketingEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-medium uppercase tracking-[0.32em] text-(--marketing-sky)">
      {children}
    </p>
  )
}

function MarketingStatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-white/8 bg-[rgba(19,27,46,0.82)] px-5 py-4">
      <p className="text-xs uppercase tracking-[0.28em] text-(--marketing-copy-soft)">{label}</p>
      <p className="mt-2 font-heading text-lg tracking-[-0.03em] text-(--marketing-heading)">
        {value}
      </p>
    </div>
  )
}

function MarketingChecklistItem({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-[22px] border border-white/8 bg-[rgba(19,27,46,0.76)] px-4 py-4">
      <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-(--marketing-gold)/12 text-(--marketing-gold)">
        <Zap className="size-4" />
      </span>
      <p className="text-sm leading-7 text-(--marketing-copy)">{children}</p>
    </div>
  )
}

function ContactInfoItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: ReactNode
}) {
  return (
    <div className="flex gap-4">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-(--marketing-panel-strong) text-(--marketing-gold)">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-(--marketing-heading)">{label}</p>
        <div className="mt-1 text-base text-(--marketing-copy)">{value}</div>
      </div>
    </div>
  )
}

function MarketingFooter() {
  return (
    <footer className="border-t border-white/6 bg-[rgba(7,16,31,0.96)]">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_220px_220px] lg:px-12">
        <div className="flex flex-col gap-6">
          <div className="space-y-3">
            <p className="font-heading text-2xl tracking-[-0.05em] text-(--marketing-heading)">
              {websiteContent.site.name}
            </p>
            <p className="max-w-sm text-sm leading-7 text-(--marketing-copy)">
              {websiteContent.footer.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {websiteContent.socialLinks.map((socialLink) => {
              const Icon = socialIconMap[socialLink.label as keyof typeof socialIconMap]

              return (
                <a
                  key={socialLink.href}
                  aria-label={`${websiteContent.site.name} on ${socialLink.label}`}
                  className="flex size-11 items-center justify-center rounded-2xl border border-white/8 bg-white/3 text-(--marketing-copy) transition-colors hover:border-(--marketing-gold)/25 hover:text-(--marketing-gold)"
                  href={socialLink.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {Icon ? <Icon className="size-5" /> : socialLink.label}
                </a>
              )
            })}
          </div>

          <p className="text-sm text-(--marketing-copy-soft)">
            © {new Date().getFullYear()} {websiteContent.site.legalName}. All rights reserved.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-medium text-(--marketing-heading)">Services</p>
          <div className="flex flex-col gap-3 text-sm text-(--marketing-copy)">
            {websiteContent.footer.servicesLinks.map((link) => (
              <Link
                key={link.href}
                className="transition-colors hover:text-(--marketing-heading)"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-medium text-(--marketing-heading)">Company</p>
          <div className="flex flex-col gap-3 text-sm text-(--marketing-copy)">
            {websiteContent.footer.companyLinks.map((link) => (
              <Link
                key={link.href}
                className="transition-colors hover:text-(--marketing-heading)"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function getServiceIcon(headline: string) {
  return serviceIconMap[headline as keyof typeof serviceIconMap] || Globe
}
