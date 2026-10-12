import Image from '@/components/image'
import Link from '@/components/router-link'
import { ArrowUp, ArrowUpRight, Check, Mail, MapPin, Phone } from 'lucide-react'
import type { ReactNode } from 'react'

import { MarketingContactForm } from '@/components/marketing/contact-form'
import {
  AngularFrame,
  PageCallToAction,
  PageFrame,
  PageHeader,
  WebsiteAction,
} from '@/components/marketing/design-system'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { MarketingNav } from '@/components/marketing/marketing-navigation'
import { websiteContent, type MarketingCaseStudy } from '@/lib/website-content'

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="marketing-shell" id="top">
      <MarketingNav />
      {children}
      <MarketingFooter />
    </div>
  )
}

export function MarketingAboutPage() {
  return (
    <PageFrame className="web-about-page">
      <section className="web-container web-about-intro">
        <div className="web-about-copy">
          <p className="web-eyebrow">About Mike · Charlevoix, Michigan</p>
          <h1 className="web-page-title">
            Local roots.
            <br />
            <span className="web-gold">Technical depth.</span>
          </h1>
          <p className="web-copy">{websiteContent.about.body}</p>
          <WebsiteAction href="/contact">Let’s talk about your website</WebsiteAction>
        </div>
        <figure className="web-about-portrait web-panel">
          <AngularFrame />
          <Image
            alt="Mike Cebulski"
            src={websiteContent.images.profile}
            width={900}
            height={1200}
            sizes="(min-width: 1024px) 36vw, (min-width: 700px) 45vw, 90vw"
            loading="eager"
          />
          <figcaption>
            <span>Mike Cebulski</span>
            <span>Website developer. Your point of contact.</span>
          </figcaption>
        </figure>
      </section>
      <section className="web-container web-about-approach web-section">
        <div>
          <p className="web-eyebrow">A direct relationship</p>
          <h2 className="web-heading">
            Good work.
            <br />
            Personal follow-through.
          </h2>
          <p className="web-copy">
            You work with the person building your website. From the first conversation to your next
            update, I keep the details moving so you can keep running your business.
          </p>
          <dl className="web-about-facts">
            {websiteContent.about.stats.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="web-about-principles">
          {websiteContent.aboutHighlights.map((highlight) => (
            <Card key={highlight.title} className="web-panel web-principle">
              <AngularFrame />
              <CardHeader>
                <CardTitle>{highlight.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{highlight.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <PageCallToAction />
    </PageFrame>
  )
}

export function MarketingContactPage({ initialInquiryType = '' }: { initialInquiryType?: string }) {
  const hybridMeetingInquiry = initialInquiryType === 'Hybrid meeting solutions'
  const workflowInquiry = initialInquiryType === 'AI & automated workflows'
  return (
    <PageFrame>
      <PageHeader
        eyebrow="Let’s talk · Northern Michigan"
        title={
          <>
            {hybridMeetingInquiry
              ? 'Better meetings.'
              : workflowInquiry
                ? 'Less busywork.'
                : 'A better website.'}
            <br />
            <span className="web-gold">
              {hybridMeetingInquiry || workflowInquiry ? 'Start here.' : 'Starts here.'}
            </span>
          </>
        }
        description={
          hybridMeetingInquiry
            ? 'Tell me about your meeting room, the people using it, and what you need to work better. I can help with planning, Zoom Rooms, kiosks, and AV integration.'
            : workflowInquiry
              ? 'Tell me about the tools you use and the repetitive tasks taking up your day. We’ll explore where automation and AI can help.'
              : 'A new website, a clearer Google presence, a smoother workflow, or a meeting room that works better. Tell me what your business needs.'
        }
      />
      <section className="web-container web-contact-page-grid">
        <aside className="web-contact-aside">
          <div>
            <div className="web-contact-details">
              <ContactInfoItem
                label="Email"
                icon={<Mail aria-hidden="true" />}
                value={
                  <a href={`mailto:${websiteContent.contact.email}`}>
                    {websiteContent.contact.email}
                  </a>
                }
              />
              <ContactInfoItem
                label="Phone"
                icon={<Phone aria-hidden="true" />}
                value={
                  <a href={`tel:${websiteContent.contact.phoneHref}`}>
                    {websiteContent.contact.phone}
                  </a>
                }
              />
              <ContactInfoItem
                label="Based in"
                icon={<MapPin aria-hidden="true" />}
                value={websiteContent.contact.location}
              />
            </div>
          </div>
          <figure className="web-local-photo">
            <Image
              alt="Charlevoix lighthouse on Lake Michigan"
              src={websiteContent.images.hero}
              width={1600}
              height={1200}
              sizes="(min-width: 1024px) 35vw, 90vw"
            />
            <figcaption>Built here. For businesses around here.</figcaption>
          </figure>
        </aside>
        <div className="web-panel web-contact-panel">
          <AngularFrame />
          <div className="web-contact-panel-heading">
            <h2>Tell me about your business.</h2>
            <p className="web-copy">A few details are all we need to get started.</p>
          </div>
          <MarketingContactForm initialInquiryType={initialInquiryType} />
        </div>
      </section>
    </PageFrame>
  )
}

export function MarketingCaseStudyPage({ caseStudy }: { caseStudy: MarketingCaseStudy }) {
  const hero = caseStudy.gallery[0]
  return (
    <PageFrame>
      <PageHeader
        eyebrow={caseStudy.eyebrow}
        title={caseStudy.title}
        description={caseStudy.intro}
      />
      <section className="web-container web-case-intro">
        <figure className="web-case-image">
          <Image
            alt={hero.imageAlt}
            src={hero.imageSrc}
            width={1600}
            height={1200}
            sizes="(min-width: 1024px) 58vw, 90vw"
            loading="eager"
          />
        </figure>
        <div className="web-panel web-case-facts">
          <AngularFrame />
          <dl>
            {caseStudy.metrics.map((metric) => (
              <div key={metric.label}>
                <dt>{metric.label}</dt>
                <dd>{metric.value}</dd>
              </div>
            ))}
          </dl>
          <Separator />
          <div>
            <p className="web-eyebrow">My role</p>
            <p className="web-copy">{caseStudy.role}</p>
          </div>
        </div>
      </section>
      <section className="web-container web-case-summary web-section">
        {caseStudy.summary.map((item) => (
          <Card key={item.title} className="web-panel">
            <AngularFrame />
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{item.body}</p>
            </CardContent>
          </Card>
        ))}
      </section>
      <section className="web-container web-case-process web-section">
        <div className="web-case-story">
          <div>
            <p className="web-eyebrow">The challenge</p>
            <p className="web-copy">{caseStudy.challenge}</p>
          </div>
          <Separator />
          <div>
            <p className="web-eyebrow">The solution</p>
            <p className="web-copy">{caseStudy.solution}</p>
          </div>
        </div>
        <div className="web-panel web-case-results">
          <AngularFrame />
          <p className="web-eyebrow">The result</p>
          <h2 className="web-heading">
            Designed to
            <br />
            work every day.
          </h2>
          <ul className="web-profile-checklist">
            {caseStudy.results.map((result) => (
              <li key={result}>
                <Check aria-hidden="true" />
                <span>{result}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="web-container web-case-gallery web-section">
        {caseStudy.gallery.slice(1).map((item) => (
          <article key={item.title}>
            <Image
              alt={item.imageAlt}
              src={item.imageSrc}
              width={1200}
              height={900}
              sizes="(min-width: 800px) 45vw, 90vw"
            />
            <h3>{item.title}</h3>
            <p className="web-copy">{item.body}</p>
          </article>
        ))}
      </section>
      <PageCallToAction
        title={caseStudy.ctaHeading}
        description={caseStudy.ctaBody}
        label="Let’s talk about your project"
      />
    </PageFrame>
  )
}

export function MarketingBlogIntro() {
  return (
    <PageHeader
      eyebrow="The journal"
      title={
        <>
          Ideas with
          <br />
          <span className="web-gold">a practical side.</span>
        </>
      }
      description={websiteContent.blogPage.body}
    />
  )
}

export function MarketingBlogContactCard() {
  return (
    <aside className="web-panel web-journal-contact">
      <AngularFrame />
      <p className="web-eyebrow">Put an idea to work</p>
      <h2 className="web-heading">
        Let’s build
        <br />
        something useful.
      </h2>
      <p className="web-copy">
        A better website, a simpler workflow, or a clearer plan for your business. Tell me what you
        have in mind.
      </p>
      <WebsiteAction href="/contact">Let’s talk</WebsiteAction>
      <Separator />
      <p className="web-journal-contact-note">
        Charlevoix, Michigan.
        <br />
        Personal support, from idea to launch.
      </p>
    </aside>
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
    <div className="web-contact-detail">
      <span>{icon}</span>
      <div>
        <p>{label}</p>
        <div>{value}</div>
      </div>
    </div>
  )
}

function MarketingFooter() {
  return (
    <footer className="web-footer">
      <AngularFrame className="web-footer-frame" />
      <div className="web-container">
        <div className="web-footer-main">
          <div className="web-footer-brand">
            <p className="web-eyebrow">Northern Michigan web development</p>
            <Link className="web-wordmark" href="/">
              {websiteContent.site.name}
            </Link>
            <p>{websiteContent.footer.description}</p>
            <Link className="web-text-link" href="/contact">
              Let’s talk about your project
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
          <nav className="web-footer-column" aria-label="Website services">
            <h2>Services</h2>
            {websiteContent.footer.servicesLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <nav className="web-footer-column" aria-label="Footer navigation">
            <h2>Explore</h2>
            {websiteContent.footer.companyLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="web-footer-column web-footer-contact">
            <h2>Talk directly with Mike</h2>
            <a href={`mailto:${websiteContent.contact.email}`}>
              <Mail aria-hidden="true" />
              <span>{websiteContent.contact.email}</span>
            </a>
            <a href={`tel:${websiteContent.contact.phoneHref}`}>
              <Phone aria-hidden="true" />
              <span>{websiteContent.contact.phone}</span>
            </a>
            <p>
              <MapPin aria-hidden="true" />
              <span>{websiteContent.contact.location}</span>
            </p>
          </div>
        </div>
        <Separator />
        <div className="web-footer-details">
          <p>
            © {new Date().getFullYear()} {websiteContent.site.legalName}
          </p>
          <p>Built here. Managed personally.</p>
          <a href="#top" className="web-back-top">
            Back to top
            <ArrowUp aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  )
}
