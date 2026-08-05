'use client'

import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  Check,
  Compass,
  MapPin,
  MessageSquareText,
  Search,
  ShieldCheck,
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
import { websiteContent } from '@/lib/website-content'

const deliverableIcons = [Search, ShieldCheck, BarChart3]

export function CharlevoixWebDesignPage() {
  const page = websiteContent.webDesignPage

  return (
    <main className="pb-24 pt-14 sm:pb-32 sm:pt-20">
      <section className="mx-auto grid max-w-[1220px] gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)] lg:items-center lg:px-12">
        <div className="flex flex-col items-start gap-6">
          <Badge
            variant="outline"
            className="h-7 border-(--marketing-sky)/35 bg-(--marketing-sky)/8 px-3 text-(--marketing-sky)"
          >
            <MapPin data-icon="inline-start" />
            {page.eyebrow}
          </Badge>
          <h1 className="max-w-[12ch] font-heading text-5xl font-semibold leading-[0.96] tracking-[-0.07em] text-balance sm:text-6xl lg:text-[4.8rem]">
            {page.title}
          </h1>
          <p className="max-w-2xl text-base leading-8 text-(--marketing-copy) sm:text-lg">
            {page.body}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className={buttonVariants({
                className:
                  'h-12 rounded-full px-5 [--primary:var(--marketing-gold)] [--primary-foreground:var(--marketing-gold-foreground)]',
              })}
            >
              Request a website consultation
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

        <Card className="rounded-[34px] border border-(--marketing-gold)/25 bg-[linear-gradient(155deg,rgba(42,51,74,0.98),rgba(19,27,46,0.98))] py-0 text-(--marketing-heading) ring-0 [--card-spacing:--spacing(7)]">
          <CardHeader className="gap-3 px-7 pt-7">
            <CardDescription className="text-xs font-medium uppercase tracking-[0.24em] text-(--marketing-sky)">
              Local website package
            </CardDescription>
            <CardTitle className="text-3xl tracking-[-0.05em]">
              Built to earn the next call.
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 px-7">
            <div className="flex items-end gap-2">
              <span className="font-heading text-5xl tracking-[-0.07em] text-(--marketing-gold)">
                $2,400
              </span>
              <span className="pb-1 text-(--marketing-copy)">starting setup</span>
            </div>
            <Separator className="bg-white/8" />
            <ul className="flex flex-col gap-4">
              {[
                'Strategy, copy, design, and development',
                'Local SEO and search indexing foundations',
                'Mobile-first performance and lead capture',
                'Optional ongoing support for $100 per month',
              ].map((item) => (
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
            Final scope and price are confirmed before work begins.
          </CardFooter>
        </Card>
      </section>

      <section className="mx-auto mt-24 max-w-[1220px] px-4 sm:px-6 lg:px-12">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-(--marketing-sky)">
            Search visibility meets human trust
          </p>
          <h2 className="mt-4 font-heading text-4xl tracking-[-0.06em] text-balance sm:text-5xl">
            Built for how people choose a local business.
          </h2>
          <p className="mt-5 text-base leading-8 text-(--marketing-copy)">
            Showing up is only half the job. Your website also needs to reassure a nearby customer
            that you understand the work, serve their area, and will follow through.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {page.deliverables.map((deliverable, index) => {
            const Icon = deliverableIcons[index] ?? Compass

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

      <section className="mx-auto mt-24 grid max-w-[1220px] gap-8 px-4 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-12">
        <div className="rounded-[32px] border border-white/8 bg-[rgba(19,27,46,0.74)] p-7 sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-(--marketing-sky)">
            What is included
          </p>
          <h2 className="mt-4 font-heading text-3xl tracking-[-0.05em] sm:text-4xl">
            One accountable partner from first draft to launch.
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {page.included.map((item) => (
              <li key={item} className="flex items-center gap-3 text-(--marketing-copy)">
                <Check className="text-(--marketing-gold)" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[32px] border border-white/8 bg-[radial-gradient(circle_at_top_right,rgba(123,208,255,0.13),transparent_40%),rgba(19,27,46,0.9)] p-7 sm:p-9">
          <div className="flex items-center gap-3 text-(--marketing-gold)">
            <Compass />
            <p className="text-xs font-semibold uppercase tracking-[0.26em]">Service area</p>
          </div>
          <h2 className="mt-4 max-w-xl font-heading text-3xl tracking-[-0.05em] sm:text-4xl">
            Based in Charlevoix. Serving businesses across Northern Michigan.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-(--marketing-copy)">
            Local context matters, especially for service businesses. The site can speak clearly to
            the communities you actually serve without resorting to thin, repetitive location pages.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {page.serviceAreas.map((area) => (
              <div key={area.name} className="rounded-[22px] border border-white/8 bg-white/3 p-5">
                <h3 className="font-heading text-xl tracking-[-0.03em]">{area.name}</h3>
                <p className="mt-2 text-sm leading-6 text-(--marketing-copy)">{area.communities}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-[1220px] px-4 sm:px-6 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-(--marketing-sky)">
              A practical process
            </p>
            <h2 className="mt-4 font-heading text-4xl tracking-[-0.06em] sm:text-5xl">
              Clear decisions, then careful execution.
            </h2>
          </div>
          <ol className="grid gap-px overflow-hidden rounded-[30px] border border-white/8 bg-white/8 sm:grid-cols-2">
            {page.process.map((step, index) => (
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

      <section className="mx-auto mt-24 max-w-[980px] px-4 sm:px-6 lg:px-12">
        <div className="flex items-center gap-3 text-(--marketing-gold)">
          <MessageSquareText />
          <p className="text-xs font-semibold uppercase tracking-[0.26em]">Common questions</p>
        </div>
        <h2 className="mt-4 font-heading text-4xl tracking-[-0.06em] sm:text-5xl">
          Before we start a website project.
        </h2>
        <div className="mt-10 flex flex-col">
          {page.faqs.map((faq, index) => (
            <div key={faq.question}>
              {index > 0 ? <Separator className="bg-white/8" /> : null}
              <article className="grid gap-3 py-7 sm:grid-cols-[0.9fr_1.1fr] sm:gap-8">
                <h3 className="font-heading text-xl tracking-[-0.03em]">{faq.question}</h3>
                <p className="text-sm leading-7 text-(--marketing-copy)">{faq.answer}</p>
              </article>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-[980px] px-4 sm:px-6 lg:px-12">
        <div className="rounded-[34px] border border-(--marketing-gold)/20 bg-[linear-gradient(145deg,rgba(45,52,73,0.96),rgba(19,27,46,0.98))] px-7 py-12 text-center shadow-[0_30px_80px_rgba(0,0,0,0.32)] sm:px-12">
          <h2 className="font-heading text-4xl tracking-[-0.06em] text-balance sm:text-5xl">
            Let&apos;s make your website easier to find—and easier to trust.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-(--marketing-copy)">
            Tell me what you do, where you work, and what a good lead looks like. I&apos;ll help map
            the right next step.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/contact"
              className={buttonVariants({
                className:
                  'h-12 rounded-full px-5 [--primary:var(--marketing-gold)] [--primary-foreground:var(--marketing-gold-foreground)]',
              })}
            >
              Start a local website project
              <ArrowRight data-icon="inline-end" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
