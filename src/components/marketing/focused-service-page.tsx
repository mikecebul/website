'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Bot,
  Cable,
  Check,
  ExternalLink,
  Mail,
  MapPin,
  Mic2,
  MonitorUp,
  Network,
  RefreshCw,
  Settings2,
  Video,
  Workflow,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { websiteContent, type WebsiteContent } from '@/lib/website-content'

type FocusedService = WebsiteContent['focusedServices'][keyof WebsiteContent['focusedServices']]

const variantIcons = {
  automation: {
    deliverables: [RefreshCw, Mail, Bot],
    eyebrow: Workflow,
    included: Network,
    proof: Settings2,
  },
  hybrid: {
    deliverables: [MonitorUp, Video, Mic2],
    eyebrow: MapPin,
    included: Cable,
    proof: Settings2,
  },
} as const

export function FocusedServicePage({ service }: { service: FocusedService }) {
  const icons = variantIcons[service.variant]
  const EyebrowIcon = icons.eyebrow
  const IncludedIcon = icons.included
  const ProofIcon = icons.proof
  const proofIsExternal = service.proof.href.startsWith('http')

  return (
    <main className="pb-24 pt-14 sm:pb-32 sm:pt-20">
      <section className="mx-auto grid max-w-[1220px] gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-center lg:px-12">
        <div className="flex flex-col items-start gap-6">
          <Badge
            variant="outline"
            className="h-7 border-(--marketing-sky)/35 bg-(--marketing-sky)/8 px-3 text-(--marketing-sky)"
          >
            <EyebrowIcon data-icon="inline-start" />
            {service.eyebrow}
          </Badge>
          <h1 className="max-w-[12ch] font-heading text-5xl font-semibold leading-[0.96] tracking-[-0.07em] text-balance sm:text-6xl lg:text-[4.8rem]">
            {service.title}
          </h1>
          <p className="max-w-2xl text-base leading-8 text-(--marketing-copy) sm:text-lg">
            {service.body}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className={buttonVariants({
                className:
                  'h-12 rounded-full px-5 [--primary:var(--marketing-gold)] [--primary-foreground:var(--marketing-gold-foreground)]',
              })}
            >
              {service.ctaLabel}
              <ArrowRight data-icon="inline-end" />
            </Link>
            <a
              href={`tel:+${websiteContent.contact.phoneHref}`}
              className={buttonVariants({
                className:
                  'h-12 rounded-full border-white/10 bg-white/3 px-5 text-(--marketing-heading) hover:bg-white/8 hover:text-(--marketing-heading)',
                variant: 'outline',
              })}
            >
              Call {websiteContent.contact.phone}
            </a>
          </div>
        </div>

        <Card className="rounded-[34px] border border-(--marketing-gold)/25 bg-[linear-gradient(155deg,rgba(42,51,74,0.98),rgba(19,27,46,0.98))] py-0 text-(--marketing-heading) ring-0">
          <CardHeader className="gap-3 px-7 pt-7">
            <CardDescription className="text-xs font-medium uppercase tracking-[0.24em] text-(--marketing-sky)">
              {service.package.eyebrow}
            </CardDescription>
            <CardTitle className="text-3xl tracking-[-0.05em]">{service.package.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 px-7">
            <div className="flex items-end gap-2">
              <span className="font-heading text-5xl tracking-[-0.07em] text-(--marketing-gold)">
                {service.package.price}
              </span>
              <span className="pb-1 text-(--marketing-copy)">{service.package.priceSuffix}</span>
            </div>
            <Separator className="bg-white/8" />
            <ul className="flex flex-col gap-4">
              {service.package.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-6 text-(--marketing-copy)"
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-(--marketing-gold) text-(--marketing-gold-foreground)">
                    <Check />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="rounded-b-[34px] border-white/8 bg-white/3 px-7 py-5 text-sm text-(--marketing-copy)">
            {service.package.footer}
          </CardFooter>
        </Card>
      </section>

      <section className="mx-auto mt-24 max-w-[1220px] px-4 sm:px-6 lg:px-12">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-(--marketing-sky)">
            What the work covers
          </p>
          <h2 className="mt-4 font-heading text-4xl tracking-[-0.06em] text-balance sm:text-5xl">
            Practical systems for everyday use.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {service.deliverables.map((deliverable, index) => {
            const Icon = icons.deliverables[index] ?? Settings2

            return (
              <Card
                key={deliverable.title}
                className="rounded-[28px] border border-white/8 bg-[rgba(19,27,46,0.88)] py-0 text-(--marketing-heading) ring-0"
              >
                <CardHeader className="gap-5 px-6 pt-6">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-(--marketing-panel-strong) text-(--marketing-gold)">
                    <Icon />
                  </span>
                  <CardTitle className="text-2xl tracking-[-0.04em]">{deliverable.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <CardDescription className="text-base leading-7 text-(--marketing-copy)">
                    {deliverable.body}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="mx-auto mt-24 grid max-w-[1220px] gap-8 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-12">
        <Card className="rounded-[32px] border border-(--marketing-sky)/18 bg-[radial-gradient(circle_at_top_right,rgba(123,208,255,0.12),transparent_42%),rgba(19,27,46,0.9)] py-0 text-(--marketing-heading) ring-0">
          <CardHeader className="gap-4 px-7 pt-7 sm:px-9 sm:pt-9">
            <div className="flex items-center gap-3 text-(--marketing-gold)">
              <ProofIcon />
              <CardDescription className="text-xs font-semibold uppercase tracking-[0.26em] text-(--marketing-sky)">
                {service.proof.eyebrow}
              </CardDescription>
            </div>
            <CardTitle className="text-4xl tracking-[-0.06em]">{service.proof.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-7 px-7 sm:px-9">
            <p className="text-base leading-8 text-(--marketing-copy)">{service.proof.body}</p>
            <ul className="grid gap-3 sm:grid-cols-3">
              {service.proof.points.map((point) => (
                <li
                  key={point}
                  className="rounded-[18px] border border-white/8 bg-white/3 p-4 text-sm leading-6 text-(--marketing-copy)"
                >
                  {point}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="rounded-b-[32px] border-white/8 bg-white/3 px-7 py-5 sm:px-9">
            <Link
              href={service.proof.href}
              target={proofIsExternal ? '_blank' : undefined}
              rel={proofIsExternal ? 'noreferrer' : undefined}
              className={buttonVariants({
                className:
                  'h-10 rounded-full border-white/10 bg-white/3 px-4 text-(--marketing-heading) hover:bg-white/8 hover:text-(--marketing-heading)',
                variant: 'outline',
              })}
            >
              {service.proof.linkLabel}
              {proofIsExternal ? (
                <ExternalLink data-icon="inline-end" />
              ) : (
                <ArrowRight data-icon="inline-end" />
              )}
            </Link>
          </CardFooter>
        </Card>

        <div className="rounded-[32px] border border-white/8 bg-[rgba(19,27,46,0.74)] p-7 sm:p-9">
          <div className="flex items-center gap-3 text-(--marketing-gold)">
            <IncludedIcon />
            <p className="text-xs font-semibold uppercase tracking-[0.26em]">What is included</p>
          </div>
          <h2 className="mt-4 font-heading text-3xl tracking-[-0.05em]">
            Clear scope from discovery through handoff.
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {service.included.map((item) => (
              <li key={item} className="flex items-center gap-3 text-(--marketing-copy)">
                <Check className="text-(--marketing-gold)" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-[1220px] px-4 sm:px-6 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-(--marketing-sky)">
              How it moves forward
            </p>
            <h2 className="mt-4 font-heading text-4xl tracking-[-0.06em] sm:text-5xl">
              Start specific. Build carefully.
            </h2>
          </div>
          <ol className="grid gap-px overflow-hidden rounded-[30px] border border-white/8 bg-white/8 sm:grid-cols-2">
            {service.process.map((step, index) => (
              <li key={step.title} className="bg-(--marketing-panel) p-7 sm:p-8">
                <p className="font-heading text-4xl tracking-[-0.06em] text-(--marketing-gold)">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-5 font-heading text-2xl tracking-[-0.04em]">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-(--marketing-copy)">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-[980px] px-4 sm:px-6 lg:px-12">
        <div className="rounded-[34px] border border-(--marketing-gold)/20 bg-[linear-gradient(145deg,rgba(45,52,73,0.96),rgba(19,27,46,0.98))] px-7 py-12 text-center shadow-[0_30px_80px_rgba(0,0,0,0.32)] sm:px-12">
          <h2 className="font-heading text-4xl tracking-[-0.06em] text-balance sm:text-5xl">
            {service.ctaTitle}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-(--marketing-copy)">
            {service.ctaBody}
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/contact"
              className={buttonVariants({
                className:
                  'h-12 rounded-full px-5 [--primary:var(--marketing-gold)] [--primary-foreground:var(--marketing-gold-foreground)]',
              })}
            >
              {service.ctaLabel}
              <ArrowRight data-icon="inline-end" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
