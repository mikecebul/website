import Link from 'next/link'
import {
  ArrowRight,
  Cog,
  CreditCard,
  HeartPulse,
  Lock,
  Rocket,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react'

import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'

type PortfolioFeature = {
  body: string
  icon: React.ComponentType<{ className?: string }>
  title: string
}

type PortfolioProject =
  | {
      badges?: string[]
      body: string
      eyebrow: string
      features?: PortfolioFeature[]
      href: string
      imageAlt?: string
      imageSrc?: string
      name: string
      orientation: 'image-left' | 'image-right'
      type: 'image'
    }
  | {
      badges: string[]
      body: string
      eyebrow: string
      features: PortfolioFeature[]
      href: string
      imageAlt: string
      imageSrc: string
      name: string
      orientation: 'image-left'
      type: 'mockup'
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
    orientation: 'image-left',
    type: 'image',
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
    orientation: 'image-right',
    type: 'image',
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
    orientation: 'image-left',
    type: 'mockup',
  },
  {
    badges: ['Stripe Checkout', 'Tournament History', 'Content Management'],
    body: 'Serving the amateur fast-pitch league in Charlevoix and Emmet County. It was my first website built in a CMS with Stripe integration for registration payments, plus a long-running archive for game history, stats, and awards spanning 23 years.',
    eyebrow: 'Sports Management',
    href: 'https://d21softball.com',
    imageAlt: 'D21 Softball sports league registration portal',
    imageSrc: '/marketing/websites/d21softball.webp',
    name: 'D21 Softball',
    orientation: 'image-right',
    type: 'image',
  },
]

const softballBullets = [
  'Online Team & Individual Registration',
  'Multi-County Tournament Scheduling',
  'Player Stats Tracking & Historical Archives',
]

const websiteDeliveryStandards = [
  {
    body: 'Third-party integrations, custom software, and business-specific workflows built to match how each organization actually operates.',
    icon: Cog,
    title: 'Custom Integrations',
  },
  {
    body: 'Every launch includes error monitoring, viewer analytics, and a portable deployment setup.',
    icon: ShieldCheck,
    title: 'Reliable By Default',
  },
  {
    body: 'Unlimited edits are available as needed, and AI-assisted workflows help turn around finished websites in about a week.',
    icon: Rocket,
    title: 'Fast Delivery, Ongoing Support',
  },
]

export function StitchWebPortfolioPage() {
  return (
    <main className="pb-24 pt-10 sm:pt-14 lg:pb-32 lg:pt-18">
      <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12">
        <div className="max-w-4xl">
          <p className="mb-4 block text-xs font-semibold uppercase tracking-[0.2em] text-(--marketing-gold)">
            Selected Works
          </p>
          <h1 className="max-w-[14ch] font-heading text-5xl font-semibold leading-[0.96] tracking-[-0.07em] sm:text-6xl lg:max-w-none lg:text-[4.4rem]">
            Web Portfolio &amp; Software <span className="text-[#facc15]">Engineering</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-(--marketing-copy) sm:text-lg">
            High-performance web solutions built around HIPAA-compliant healthcare integrations,
            complex forms with specific business logic, and automated email notifications that also
            follow the same operational rules.
          </p>
        </div>
      </section>

      <div className="mx-auto mt-20 max-w-[1440px] space-y-24 px-4 sm:space-y-32 sm:px-6 lg:space-y-48 lg:px-12">
        {portfolioProjects.map((project) => {
          if (project.type === 'mockup') {
            return <JuniorGolfPortfolioSection key={project.name} project={project} />
          }

          const media = (
            <div className="overflow-hidden rounded-[22px] border border-white/8 bg-(--marketing-panel) shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
              <img
                alt={project.imageAlt}
                className="aspect-video w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                src={project.imageSrc}
              />
            </div>
          )

          const content = (
            <div>
              <div className="mb-4 flex items-center gap-3">
                <ProjectEyebrow>{project.eyebrow}</ProjectEyebrow>
              </div>
              <h2 className="mb-6 font-heading text-4xl tracking-[-0.05em] text-(--marketing-gold) sm:text-[2.5rem]">
                {project.name}
              </h2>
              <p className="mb-8 text-base leading-8 text-(--marketing-copy)">{project.body}</p>
              {project.features?.length ? (
                <div className="space-y-6">
                  {project.features.map((feature) => (
                    <FeatureItem key={feature.title} feature={feature} />
                  ))}
                </div>
              ) : (
                <ul className="mb-8 space-y-4">
                  {softballBullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-3 text-(--marketing-copy)">
                      <span className="size-1.5 rounded-full bg-(--marketing-gold)" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
              {project.badges ? (
                <div className="mt-10 flex flex-wrap gap-2">
                  {project.badges.map((badge) => (
                    <span
                      key={badge}
                      className="rounded-full bg-[rgba(45,52,73,0.95)] px-3 py-1 text-xs text-(--marketing-gold)"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="mt-10">
                <Link
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-(--marketing-gold) transition-all duration-300 hover:gap-4"
                  href={project.href}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  Visit Site
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          )

          const isImageLeft = project.orientation === 'image-left'

          return (
            <section
              key={project.name}
              className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12"
            >
              <div className={cn('lg:col-span-7', !isImageLeft && 'lg:order-2')}>{media}</div>
              <div className={cn('lg:col-span-5', !isImageLeft && 'lg:order-1')}>{content}</div>
            </section>
          )
        })}
      </div>

      <section className="mx-auto mt-24 max-w-[1440px] px-4 sm:mt-32 sm:px-6 lg:px-12">
        <div className="mb-8 max-w-2xl">
          <ProjectEyebrow>Every Website Includes</ProjectEyebrow>
          <h2 className="mt-3 font-heading text-3xl tracking-[-0.05em] sm:text-4xl">
            Delivery standards that stay useful after launch.
          </h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {websiteDeliveryStandards.map((item) => {
            const Icon = item.icon

            return (
              <div
                key={item.title}
                className="rounded-[24px] border border-white/8 bg-[rgba(19,27,46,0.84)] px-6 py-6 shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
              >
                <span className="flex size-11 items-center justify-center rounded-2xl bg-(--marketing-gold)/12 text-(--marketing-gold)">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 font-heading text-2xl tracking-[-0.04em] text-(--marketing-heading)">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-(--marketing-copy)">{item.body}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section
        className="mx-auto mt-24 max-w-[1440px] px-4 text-center sm:mt-32 sm:px-6 lg:mt-48 lg:px-12"
        id="consultation-cta"
      >
        <div className="relative overflow-hidden rounded-[28px] bg-[rgba(19,27,46,0.92)] px-6 py-16 sm:px-10 lg:px-12 lg:py-24">
          <div className="absolute right-0 top-0 size-64 rounded-full bg-(--marketing-gold)/6 blur-[100px]" />
          <div className="relative z-10">
            <h3 className="font-heading text-4xl tracking-[-0.06em] sm:text-5xl">
              Ready to build your next <span className="text-[#facc15]">digital platform?</span>
            </h3>
            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-(--marketing-copy)">
              Whether it&apos;s a HIPAA-compliant healthcare portal or a custom business automation
              tool, I bring technical precision to every pixel.
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                className={cn(
                  buttonVariants({ size: 'xl', variant: 'default' }),
                  'rounded-lg bg-linear-to-br from-(--marketing-gold) to-[#facc15] px-10 py-4 text-sm font-black uppercase tracking-[0.24em] text-(--marketing-gold-foreground) shadow-[0_22px_44px_rgba(238,194,0,0.2)] hover:scale-[1.02] hover:opacity-95',
                )}
                href="/contact"
              >
                Start Your Project
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function ProjectEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-[0.28em] text-(--marketing-copy-soft)">
      {children}
    </span>
  )
}

function FeatureItem({ feature }: { feature: PortfolioFeature }) {
  const Icon = feature.icon

  return (
    <div className="flex items-start gap-4">
      <Icon className="mt-1 size-5 text-[#facc15]" />
      <div>
        <h4 className="font-semibold text-(--marketing-heading)">{feature.title}</h4>
        <p className="mt-1 text-sm leading-6 text-(--marketing-copy-soft)">{feature.body}</p>
      </div>
    </div>
  )
}

function JuniorGolfPortfolioSection({
  project,
}: {
  project: Extract<PortfolioProject, { type: 'mockup' }>
}) {
  return (
    <section className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7 overflow-hidden rounded-[22px] border border-white/8 bg-(--marketing-panel) shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
        <img
          alt={project.imageAlt}
          className="aspect-video w-full object-cover object-top transition-transform duration-700 hover:scale-[1.02]"
          src={project.imageSrc}
        />
      </div>

      <div className="lg:col-span-5">
        <div className="mb-4 flex items-center gap-3">
          <Users className="size-5 text-(--marketing-gold)" />
          <ProjectEyebrow>{project.eyebrow}</ProjectEyebrow>
        </div>
        <h2 className="mb-6 font-heading text-4xl tracking-[-0.05em] text-(--marketing-gold) sm:text-[2.5rem]">
          {project.name}
        </h2>
        <p className="mb-8 text-base leading-8 text-(--marketing-copy)">{project.body}</p>
        <div className="space-y-6">
          {project.features.map((feature) => (
            <FeatureItem key={feature.title} feature={feature} />
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-2">
          {project.badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full bg-[rgba(45,52,73,0.95)] px-3 py-1 text-xs text-(--marketing-gold)"
            >
              {badge}
            </span>
          ))}
        </div>
        <div className="mt-10">
          <Link
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-(--marketing-gold) transition-all duration-300 hover:gap-4"
            href={project.href}
            rel="noreferrer noopener"
            target="_blank"
          >
            Visit Site
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export function StitchWebPortfolioPageMetadataNotice() {
  return null
}
