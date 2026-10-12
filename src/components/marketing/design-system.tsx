import Image from '@/components/image'
import Link from '@/components/router-link'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'

export function WebsiteBackdrop({
  variant,
  namespace = 'website',
}: {
  variant: 'hero' | 'work'
  namespace?: string
}) {
  const id = `${namespace}-${variant}-backdrop`
  const hero = variant === 'hero'

  return (
    <svg
      className={`web-backdrop web-backdrop-${variant}`}
      viewBox={`0 0 1440 ${hero ? 800 : 680}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={`${id}-grid`} width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M 28 0 H 0 V 28" fill="none" stroke="#1777b2" strokeWidth="0.6" />
        </pattern>
        <linearGradient id={`${id}-grid-fade`}>
          <stop offset="18%" stopColor="white" stopOpacity="0" />
          <stop offset="52%" stopColor="white" stopOpacity="0.6" />
          <stop offset="100%" stopColor="white" stopOpacity="0.85" />
        </linearGradient>
        <mask id={`${id}-grid-mask`}>
          <rect width="1440" height="800" fill={`url(#${id}-grid-fade)`} />
        </mask>
        <radialGradient id={`${id}-light`} cx="75%" cy="48%" r="65%">
          <stop offset="0" stopColor="#087cc5" stopOpacity="0.42" />
          <stop offset="48%" stopColor="#064979" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#031426" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-plane`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#315584" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#0c3963" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#041526" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id={`${id}-edge`}>
          <stop offset="0" stopColor="#1677bc" stopOpacity="0.2" />
          <stop offset="38%" stopColor="#29baff" />
          <stop offset="100%" stopColor="#0099f3" stopOpacity="0.8" />
        </linearGradient>
        <filter id={`${id}-glow`} x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <rect width="1440" height="800" fill={`url(#${id}-light)`} />
      <rect
        width="1440"
        height="800"
        fill={`url(#${id}-grid)`}
        mask={`url(#${id}-grid-mask)`}
        opacity={hero ? 0.6 : 0.85}
      />
      {hero ? (
        <>
          <path
            d="M 565 760 C 508 440 660 216 914 194 C 1170 170 1434 346 1510 590"
            fill="none"
            stroke="#009dff"
            strokeWidth="7"
            opacity="0.65"
            filter={`url(#${id}-glow)`}
          />
          <path
            d="M 565 760 C 508 440 660 216 914 194 C 1170 170 1434 346 1510 590"
            fill="none"
            stroke={`url(#${id}-edge)`}
            strokeWidth="1.3"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 475 760 C 387 382 636 51 982 65 C 1294 78 1535 309 1580 558"
            fill="none"
            stroke="#147bb5"
            strokeWidth="0.7"
            opacity="0.45"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M 683 0 C 1078 -78 1478 99 1528 440 C 1561 651 1363 651 1224 555"
            fill="none"
            stroke={`url(#${id}-edge)`}
            strokeWidth="1"
            opacity="0.65"
            vectorEffect="non-scaling-stroke"
          />
          <path d="M 320 665 L 1026 327 L 1440 503 V 800 H 0 Z" fill={`url(#${id}-plane)`} />
          <path
            d="M 320 665 L 1026 327 L 1440 503"
            fill="none"
            stroke="#3775ad"
            strokeWidth="0.7"
            vectorEffect="non-scaling-stroke"
          />
        </>
      ) : (
        <>
          <path d="M 0 505 L 760 255 L 1440 368 V 680 H 0 Z" fill={`url(#${id}-plane)`} />
          <path
            d="M 0 505 L 760 255 L 1440 368"
            fill="none"
            stroke={`url(#${id}-edge)`}
            strokeWidth="0.8"
            vectorEffect="non-scaling-stroke"
          />
          <path d="M 230 680 L 1020 372 L 1440 490 V 680 Z" fill="#06213c" opacity="0.8" />
          <path
            d="M 230 680 L 1020 372 L 1440 490 M 760 255 V 395 L 890 435 L 890 350"
            fill="none"
            stroke={`url(#${id}-edge)`}
            strokeWidth="0.7"
            vectorEffect="non-scaling-stroke"
          />
        </>
      )}
    </svg>
  )
}

export function WebsiteAction({
  children,
  href,
  className,
}: {
  children: ReactNode
  href: string
  className?: string
}) {
  return (
    <Link href={href} className={cn(buttonVariants({ size: 'lg' }), 'web-cta', className)}>
      {children}
      <ArrowRight data-icon="inline-end" aria-hidden="true" />
    </Link>
  )
}

export function WebsitePreview({
  src,
  alt,
  label,
  eager = false,
  className,
}: {
  src: string
  alt: string
  label: string
  eager?: boolean
  className?: string
}) {
  return (
    <div className={cn('web-preview', className)}>
      <div className="web-preview-toolbar" aria-hidden="true">
        <span className="web-preview-dots">
          <i />
          <i />
          <i />
        </span>
        <span>{label}</span>
        <span className="web-preview-toolbar-end" />
      </div>
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={900}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        sizes="(min-width: 1440px) 620px, (min-width: 900px) 48vw, 90vw"
      />
    </div>
  )
}

export function AngularFrame({ className }: { className?: string }) {
  return <div className={cn('web-angular-frame', className)} aria-hidden="true" />
}

export function PageFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <main className={cn('web-page', className)}>
      <div className="web-page-atmosphere" aria-hidden="true">
        <WebsiteBackdrop variant="hero" namespace="page" />
      </div>
      {children}
    </main>
  )
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
  visual,
}: {
  eyebrow: ReactNode
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  className?: string
  visual?: ReactNode
}) {
  return (
    <header
      className={cn(
        'web-container web-page-header',
        visual && 'web-page-header-with-visual',
        className,
      )}
    >
      {visual ? (
        <>
          <div className="web-page-header-copy">
            <p className="web-eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            {description ? <p className="web-copy">{description}</p> : null}
            {children}
          </div>
          {visual}
        </>
      ) : (
        <>
          <p className="web-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          {description ? <p className="web-copy">{description}</p> : null}
          {children}
        </>
      )}
    </header>
  )
}

export function PageCallToAction({
  title = (
    <>
      Your next website.
      <br />
      <span className="web-gold">Handled.</span>
    </>
  ),
  description = 'Tell me about your business and the website you need. I’ll help you find the right starting point.',
  label = 'Let’s build your website',
  href = '/contact',
}: {
  title?: ReactNode
  description?: string
  label?: string
  href?: string
}) {
  return (
    <section className="web-container web-page-cta">
      <AngularFrame className="web-page-cta-frame" />
      <div>
        <p className="web-eyebrow">Let’s make it happen</p>
        <h2 className="web-heading">{title}</h2>
        <p className="web-copy">{description}</p>
      </div>
      <WebsiteAction href={href}>{label}</WebsiteAction>
    </section>
  )
}
