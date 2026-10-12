import { ArrowRight, Cog, CreditCard, HeartPulse, Lock, Sparkles, Users } from 'lucide-react'

import { AngularFrame, WebsitePreview } from '@/components/marketing/design-system'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

type PortfolioFeature = {
  body: string
  icon: React.ComponentType<{ className?: string }>
  title: string
}

type PortfolioProject = {
  badges: string[]
  body: string
  eyebrow: string
  features?: PortfolioFeature[]
  href: string
  imageAlt: string
  imageSrc: string
  name: string
}

const portfolioProjects: PortfolioProject[] = [
  {
    badges: ['Stripe', 'Cal.com', 'Custom Dashboard'],
    body: "Redefining drug testing operations with a completely digital, 'no paperwork' workflow. This platform streamlines complex logistics between providers, labs, and clients through a centralized dashboard.",
    eyebrow: 'Cofounder & CTO',
    features: [
      {
        body: 'Automated intake and reporting, eliminating physical paper trails entirely.',
        icon: Sparkles,
        title: 'Digital Workflow',
      },
      {
        body: 'Seamless connectivity with Redwood Labs for data, Cal.com scheduling, and Stripe payments for both online and on-site testing.',
        icon: Cog,
        title: 'Third-Party Integrations',
      },
    ],
    href: 'https://www.midrugtest.com',
    imageAlt: 'MI Drug Test dashboard interface',
    imageSrc: '/marketing/websites/midrugtest.webp',
    name: 'MI Drug Test',
  },
  {
    badges: ['HIPAA Secure', 'Simple Practice', 'Custom Dashboard'],
    body: 'A critical digital bridge for behavioral health services in Northern Michigan. The project focused on providing secure, compliant access to care while maintaining a welcoming user experience.',
    eyebrow: 'Healthcare Compliance',
    features: [
      {
        body: 'Fully encrypted contact forms and data handling protecting PHI.',
        icon: Lock,
        title: 'HIPAA Compliance',
      },
      {
        body: 'Direct entry point to the Simple Practice client portal for easy scheduling.',
        icon: HeartPulse,
        title: 'Simple Practice Integration',
      },
    ],
    href: 'https://www.basesmi.org',
    imageAlt: 'BASES healthcare website interface',
    imageSrc: '/marketing/websites/bases.webp',
    name: 'BASES',
  },
  {
    body: 'A modern digital hub for the local junior golf community. Transitioned a legacy registration process into a seamless, professional online experience that parents trust.',
    badges: ['Stripe', 'Registration Form', 'Custom Dashboard'],
    eyebrow: 'Community Project',
    features: [
      {
        body: 'Integrated Stripe payment processing for instant, secure program registrations.',
        icon: CreditCard,
        title: 'Secure Payments',
      },
      {
        body: 'Automated registration tracking for coaches and league administrators.',
        icon: Users,
        title: 'Roster Management',
      },
    ],
    href: 'https://www.cvxjrgolf.com',
    imageAlt: 'Charlevoix Junior Golf website interface',
    imageSrc: '/marketing/websites/cvxjrgolf.webp',
    name: 'Charlevoix Junior Golf',
  },
  {
    badges: ['Stripe Checkout', 'Tournament History', 'Content Management'],
    body: 'Serving the amateur fast-pitch league in Charlevoix and Emmet County. It was my first website built in a CMS with Stripe integration for registration payments, plus a long-running archive for game history, stats, and awards spanning 23 years.',
    eyebrow: 'Sports Management',
    href: 'https://d21softball.com',
    imageAlt: 'D21 Softball sports league registration portal',
    imageSrc: '/marketing/websites/d21softball.webp',
    name: 'D21 Softball',
  },
]

const softballBullets = [
  'Online Team & Individual Registration',
  'Multi-County Tournament Scheduling',
  'Player Stats Tracking & Historical Archives',
]

export function WebsitePortfolio() {
  return (
    <section id="selected-work" className="web-portfolio" aria-labelledby="website-portfolio-title">
      <header className="web-container web-portfolio-heading">
        <div>
          <p className="web-eyebrow">Selected projects · Built in Northern Michigan</p>
          <h2 id="website-portfolio-title" className="web-heading">
            Real businesses.
            <br />
            <span className="web-gold">Real websites.</span>
          </h2>
        </div>
        <p className="web-copy">
          A few examples of what I build. Projects with payments, registrations, dashboards, or
          other custom features are scoped separately from the simple marketing website package.
        </p>
      </header>
      <div className="web-container web-portfolio-projects">
        {portfolioProjects.map((project, index) => (
          <Card
            key={project.name}
            className="web-panel web-portfolio-card"
            role="group"
            aria-labelledby={`website-project-${index}`}
          >
            <AngularFrame />
            <CardHeader>
              <p className="web-eyebrow">{project.eyebrow}</p>
              <CardTitle>
                <h3 id={`website-project-${index}`}>{project.name}</h3>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                className="web-project-preview-link"
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${project.name} website (opens in a new tab)`}
              >
                <WebsitePreview
                  src={project.imageSrc}
                  alt={project.imageAlt}
                  label={new URL(project.href).hostname}
                />
              </a>
              <div className="web-portfolio-badges">
                {project.badges?.map((badge) => (
                  <Badge key={badge} variant="outline">
                    {badge}
                  </Badge>
                ))}
              </div>
              <p className="web-copy">{project.body}</p>
              <Accordion>
                <AccordionItem value="details">
                  <AccordionTrigger aria-label={`${project.name} project details`}>
                    What went into the build
                  </AccordionTrigger>
                  <AccordionContent>
                    {project.features?.length ? (
                      <div className="web-portfolio-features">
                        {project.features.map((feature) => (
                          <div key={feature.title}>
                            <feature.icon aria-hidden="true" />
                            <div>
                              <h4>{feature.title}</h4>
                              <p>{feature.body}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ul className="web-portfolio-bullets">
                        {softballBullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter>
              <a
                className="web-text-link"
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit {project.name}
                <ArrowRight aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
