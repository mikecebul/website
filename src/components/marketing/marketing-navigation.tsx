'use client'

import Link from '@/components/router-link'
import { useLocation } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { websiteContent } from '@/lib/website-content'

const mobileLinks = [
  { href: '/', label: 'Home' },
  { href: '/websites', label: 'Websites' },
  { href: '/hybrid-meeting-solutions', label: 'Hybrid meetings' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/blog', label: 'Journal' },
]

function MenuCircuitPattern() {
  return (
    <svg
      className="web-menu-circuit"
      viewBox="0 0 400 840"
      preserveAspectRatio="xMaxYMax slice"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id="menu-circuit-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" stroke="currentColor" strokeOpacity="0.07" />
        </pattern>
      </defs>
      <path d="M0 0H400V840H0Z" fill="url(#menu-circuit-grid)" />
      <g stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.22">
        <path d="M374 0V90L386 102V302L352 336V472" />
        <path d="M350 0V166L326 190V310" />
        <path d="M400 222L370 252V390L318 442V520L226 612H0" />
        <path d="M400 418L280 538H210L130 618H42V732" />
        <path d="M400 568H326L266 628H176L12 792" />
        <path d="M400 742L352 694V612L318 578H284" />
        <path d="M96 840V754L148 702H228L256 730V804" />
        <path d="M0 582H108L168 522" />
        <path d="M400 804L340 744H306" />
      </g>
      <g stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.8">
        <circle cx="352" cy="472" r="2.5" />
        <circle cx="42" cy="732" r="2.5" />
        <circle cx="284" cy="578" r="2.5" />
        <circle cx="256" cy="804" r="2.5" />
      </g>
      <g fill="currentColor" fillOpacity="0.3">
        <circle cx="326" cy="310" r="2.5" />
        <circle cx="168" cy="522" r="2.5" />
        <circle cx="306" cy="744" r="2.5" />
      </g>
    </svg>
  )
}

function isCurrentRoute(pathname: string, href: string) {
  return pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))
}

export function MarketingNav() {
  const pathname = useLocation({ select: (location) => location.pathname })
  return (
    <header className="web-nav">
      <div className="web-nav-inner web-container">
        <Link className="web-wordmark" href="/" aria-label="Mike Cebulski home">
          {websiteContent.site.name}
        </Link>
        <div className="web-nav-actions">
          <nav className="web-nav-links" aria-label="Main navigation">
            {websiteContent.headerNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="web-nav-link"
                aria-current={isCurrentRoute(pathname, item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/contact" className={cn(buttonVariants({ size: 'lg' }), 'web-cta')}>
            Start a project
          </Link>
          <MarketingMobileNav />
        </div>
      </div>
    </header>
  )
}

function MarketingMobileNav() {
  const pathname = useLocation({ select: (location) => location.pathname })
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="web-mobile-trigger"
          aria-label="Open navigation"
        >
          <Menu aria-hidden="true" />
        </Button>
      </DrawerTrigger>
      <DrawerContent
        className="marketing-shell web-mobile-menu"
        overlayClassName="web-mobile-menu-overlay"
      >
        <MenuCircuitPattern />
        <div className="web-mobile-menu-header">
          <div>
            <p className="web-eyebrow">Websites. Handled.</p>
            <DrawerTitle>{websiteContent.site.name}</DrawerTitle>
          </div>
          <DrawerDescription className="sr-only">
            Explore website development, hybrid meeting solutions, and ways to get in touch with
            Mike Cebulski.
          </DrawerDescription>
          <DrawerClose asChild>
            <Button
              variant="secondary"
              size="icon"
              className="web-menu-close"
              aria-label="Close navigation"
            >
              <X aria-hidden="true" />
            </Button>
          </DrawerClose>
        </div>
        <Separator />
        <div className="web-mobile-menu-body">
          <nav aria-label="Mobile navigation">
            {mobileLinks.map((item) => (
              <DrawerClose key={item.href} asChild>
                <Link
                  href={item.href}
                  className="web-mobile-link"
                  aria-current={isCurrentRoute(pathname, item.href) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </DrawerClose>
            ))}
          </nav>
          <div className="web-mobile-menu-bottom">
            <DrawerClose asChild>
              <Link href="/contact" className={cn(buttonVariants({ size: 'lg' }), 'web-cta')}>
                Start a project
              </Link>
            </DrawerClose>
            <p className="web-mobile-menu-caption">Websites · Workflows · Meeting spaces</p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
