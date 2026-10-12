import Link from '@/components/router-link'
import Image from '@/components/image'
import { ArrowUpRight, Check } from 'lucide-react'

import {
  PageFrame,
  PageHeader,
  AngularFrame,
  WebsiteAction,
  WebsiteBackdrop,
  WebsitePreview,
} from '@/components/marketing/design-system'
import { WebsitePortfolio } from '@/components/marketing/website-portfolio'
import { MarketingContactForm } from '@/components/marketing/contact-form'
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

export function WebsitePricing() {
  const offer = websiteContent.websiteOffer
  return (
    <section
      id="websites"
      aria-label="Website setup and monthly management pricing"
      className="web-pricing web-container"
    >
      <div className="web-pricing-panel">
        <div className="web-angular-frame web-pricing-frame" aria-hidden="true" />
        <div className="web-pricing-grid">
          <div>
            <p className="web-eyebrow">Quick setup</p>
            <p className="web-price">
              ${offer.setupPrice}
              <span>one-time</span>
            </p>
            <p className="web-pricing-description">{offer.setupDescription}</p>
          </div>
          <div>
            <p className="web-eyebrow">Ongoing management</p>
            <p className="web-price">
              ${offer.monthlyPrice}
              <span>/month</span>
            </p>
            <p className="web-pricing-description">{offer.managementDescription}</p>
          </div>
        </div>
        <Separator />
        <p className="web-pricing-note">{offer.qualification}</p>
      </div>
    </section>
  )
}

function WebsiteWork() {
  return (
    <section id="work" className="web-work web-container" aria-labelledby="web-work-title">
      <WebsiteBackdrop variant="work" />
      <div className="web-work-heading">
        <p className="web-eyebrow">Selected custom projects</p>
        <h2 id="web-work-title" className="web-heading">
          Local work.
          <br />
          Real businesses.
        </h2>
        <Link href="/websites#selected-work" className="web-text-link">
          Explore the website projects
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </div>
      <a
        href="https://www.midrugtest.com"
        target="_blank"
        rel="noopener noreferrer"
        className="web-work-project web-work-primary"
        aria-label="Visit MI Drug Test (opens in a new tab)"
      >
        <WebsitePreview
          src="/marketing/websites/midrugtest.webp"
          alt="MI Drug Test website with drug testing services and Charlevoix location information"
          label="midrugtest.com"
        />
        <span className="web-project-caption">
          MI Drug Test
          <ArrowUpRight aria-hidden="true" />
        </span>
      </a>
      <a
        href="https://d21softball.com"
        target="_blank"
        rel="noopener noreferrer"
        className="web-work-project web-work-secondary"
        aria-label="Visit D21 Softball (opens in a new tab)"
      >
        <WebsitePreview
          src="/marketing/websites/d21softball.webp"
          alt="D21 Softball website featuring a local game at sunset"
          label="d21softball.com"
        />
        <span className="web-project-caption">
          D21 Softball
          <ArrowUpRight aria-hidden="true" />
        </span>
      </a>
      <span className="web-work-outline" aria-hidden="true">
        Built
        <br />
        local
      </span>
    </section>
  )
}

export function LocalVisibilitySection() {
  return (
    <section
      id="google-business-profile"
      className="web-visibility web-container"
      aria-labelledby="web-visibility-title"
    >
      <div className="web-angular-frame web-visibility-frame" aria-hidden="true" />
      <div className="web-visibility-copy">
        <p className="web-eyebrow">Local visibility</p>
        <h2 id="web-visibility-title" className="web-heading">
          A fast website.
          <br />A stronger first impression.
        </h2>
        <p className="web-copy">
          Fast loading and clear content build customer confidence and support your visibility on
          Google.
        </p>
        <p className="web-visibility-signoff">Built for people. Ready for search.</p>
      </div>
      <Card className="web-profile-card">
        <div className="web-angular-frame web-profile-frame" aria-hidden="true" />
        <CardHeader>
          <p className="web-eyebrow">Google Business Profile</p>
          <CardTitle>
            <h3>Make your business easier to find.</h3>
          </CardTitle>
          <CardDescription>
            Help with verification, categories, hours, contact details, and photos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="web-profile-checklist">
            {['Verification support', 'Complete business details', 'Services and photos'].map(
              (item) => (
                <li key={item}>
                  <Check aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ),
            )}
          </ul>
        </CardContent>
        <CardFooter>
          <p>Affordable one-time setup help.</p>
          <WebsiteAction href="/contact?inquiry=google-business-profile">
            Ask about profile setup
          </WebsiteAction>
        </CardFooter>
      </Card>
    </section>
  )
}

export function WebsiteContactSection() {
  return (
    <section id="contact" className="web-contact web-container" aria-labelledby="web-contact-title">
      <div>
        <p className="web-eyebrow">Get in touch</p>
        <h2 id="web-contact-title" className="web-heading">
          Let’s build
          <br />
          something.
        </h2>
        <p className="web-copy">Tell me about your business and the website you need.</p>
        <a href={`tel:${websiteContent.contact.phoneHref}`} className="web-text-link">
          {websiteContent.contact.phone}
        </a>
      </div>
      <MarketingContactForm />
    </section>
  )
}

export function WebDevelopmentHomePage() {
  return (
    <main className="web-home">
      <section className="web-hero web-container" aria-labelledby="web-hero-title">
        <WebsiteBackdrop variant="hero" />
        <div className="web-hero-copy">
          <p className="web-eyebrow">{websiteContent.home.eyebrow}</p>
          <h1 id="web-hero-title">
            Get found.
            <br />
            <span>Earn trust.</span>
          </h1>
          <p className="web-copy">{websiteContent.home.body}</p>
          <WebsiteAction href="/contact">Let’s build your website</WebsiteAction>
        </div>
        <div className="web-hero-visual">
          <WebsitePreview
            src="/marketing/websites/bases.webp"
            alt="BASES website for substance use and mental health counseling in Northern Michigan"
            label="basesmi.org"
            eager
            className="web-hero-preview-back"
          />
          <WebsitePreview
            src="/marketing/websites/cvxjrgolf.webp"
            alt="Charlevoix Junior Golf website with local golfers and program information"
            label="cvxjrgolf.com"
            eager
            className="web-hero-preview-front"
          />
        </div>
      </section>
      <WebsitePricing />
      <WebsiteWork />
      <LocalVisibilitySection />
      <section className="web-container web-other-services" aria-labelledby="other-services-title">
        <WebsiteBackdrop variant="work" namespace="other-services" />
        <header className="web-other-services-heading">
          <p className="web-eyebrow">More ways to help</p>
          <h2 id="other-services-title" className="web-heading">
            Practical tech. <span>Personal support.</span>
          </h2>
        </header>
        <div className="web-other-services-grid">
          <Card className="web-other-service web-other-service-meetings">
            <AngularFrame />
            <div className="web-service-illustration web-installation-photo">
              <Image
                src="/marketing/hybrid/kiosk-card-crop.webp"
                alt="My installed touchscreen meeting kiosk in Charlevoix, ready to start a hybrid meeting"
                width={1600}
                height={1320}
                style={{
                  height: '100%',
                  width: 'auto',
                  maxWidth: '100%',
                  marginInline: 'auto',
                  objectFit: 'contain',
                }}
                sizes="(max-width: 760px) 100vw, 50vw"
              />
            </div>
            <CardHeader>
              <p className="web-eyebrow">In the room & online</p>
              <CardTitle>
                <h3>Hybrid meeting solutions</h3>
              </CardTitle>
              <CardDescription>Bring the room and remote attendees together.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Zoom Rooms, meeting kiosks, and AV systems. Planned, installed, and supported
                locally.
              </p>
            </CardContent>
            <CardFooter>
              <WebsiteAction href="/hybrid-meeting-solutions">
                Explore hybrid meetings
              </WebsiteAction>
            </CardFooter>
          </Card>
          <Card className="web-other-service web-other-service-workflows">
            <AngularFrame />
            <div className="web-service-illustration" aria-hidden="true">
              <Image
                src="/marketing/automated-workflows.webp"
                alt=""
                fill
                sizes="(max-width: 760px) 100vw, 50vw"
              />
            </div>
            <CardHeader>
              <p className="web-eyebrow">Make the everyday easier</p>
              <CardTitle>
                <h3>AI & automated workflows</h3>
              </CardTitle>
              <CardDescription>Less repetitive work. More time for your business.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Connect the tools you already use and explore practical AI help for your daily work.
              </p>
            </CardContent>
            <CardFooter>
              <WebsiteAction href="/contact?inquiry=automated-workflows">
                Talk through your workflow
              </WebsiteAction>
            </CardFooter>
          </Card>
        </div>
      </section>
      <WebsiteContactSection />
    </main>
  )
}

export function WebDevelopmentWebsitesPage() {
  return (
    <PageFrame className="web-services">
      <PageHeader
        eyebrow="Website development · Northern Michigan"
        visual={
          <figure className="web-website-concept">
            <div className="web-concept-toolbar" aria-hidden="true">
              <span>● ● ●</span>
              <span>Website layout concept</span>
            </div>
            <div className="web-concept-site">
              <div className="web-concept-brand">
                Your business<span>Local. Professional. Ready.</span>
              </div>
              <div className="web-concept-hero">
                <div>
                  <p className="web-eyebrow">Right here in Northern Michigan</p>
                  <p className="web-concept-title">
                    A great first impression.<span>Starts online.</span>
                  </p>
                  <p>Show customers what you do, where to find you, and how to get in touch.</p>
                  <span className="web-concept-button">
                    Get in touch <ArrowUpRight aria-hidden="true" />
                  </span>
                </div>
                <Image
                  src={websiteContent.images.hero}
                  alt="Charlevoix lighthouse used in a sample local business website layout"
                  width={1600}
                  height={1200}
                  sizes="(max-width: 800px) 40vw, 25vw"
                />
              </div>
              <div className="web-concept-details">
                <span>Clear services</span>
                <span>Local visibility</span>
                <span>Easy contact</span>
              </div>
            </div>
            <figcaption>Your business, presented clearly. Built for every screen.</figcaption>
          </figure>
        }
        title={
          <>
            Websites.
            <br />
            <span className="web-gold">handled.</span>
          </>
        }
        description="A clear, fast website that helps customers find your business and feel confident getting in touch. Explore the simple website package, see my work, and tell me what you need."
      >
        <WebsiteAction href="/contact">Let’s build your website</WebsiteAction>
        <nav className="web-page-jumps" aria-label="On this page">
          <Link href="#websites">Website package</Link>
          <Link href="#selected-work">Website projects</Link>
          <Link href="#google-business-profile">Google visibility</Link>
        </nav>
      </PageHeader>
      <WebsitePricing />
      <section
        id="website-package"
        className="web-container web-scope"
        aria-labelledby="web-scope-title"
      >
        <div>
          <p className="web-eyebrow">Keep it simple</p>
          <h2 id="web-scope-title" className="web-heading">
            The essentials.
            <br />
            Done well.
          </h2>
        </div>
        <div className="web-scope-copy">
          <p className="web-copy">
            The simple website package fits businesses that need to explain their services, show
            their work, share their location, and make it easy for customers to reach out.
          </p>
          <ul className="web-profile-checklist">
            {[
              'A polished layout for phones, tablets, and desktops',
              'Fast pages with clear service and location content',
              'A contact form and easy ways to call or email',
              'Website updates handled personally by me',
            ].map((item) => (
              <li key={item}>
                <Check aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="web-copy">
            Need a CMS, online payments, registrations, a dashboard, or integrations? I build those
            too. We’ll agree on a separate scope and quote before work begins.
          </p>
          <Link href="/websites#selected-work" className="web-text-link">
            Explore the website projects
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </section>
      <WebsitePortfolio />
      <LocalVisibilitySection />
      <WebsiteContactSection />
    </PageFrame>
  )
}
