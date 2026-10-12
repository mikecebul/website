'use client'

import Link from '@/components/router-link'
import { useLocation } from '@tanstack/react-router'
import { ArrowRight, ArrowUpRight, Mail, MapPin, Menu, Phone, X } from 'lucide-react'
import { AngularFrame } from '@/components/marketing/design-system'
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
  { href: '/', label: 'Home', description: 'Your next website, handled.' },
  {
    href: '/websites',
    label: 'Websites',
    description: 'Packages, projects, and personal support.',
  },
  {
    href: '/hybrid-meeting-solutions',
    label: 'Hybrid meetings',
    description: 'Zoom Rooms, kiosks, and AV integration.',
  },
  { href: '/about', label: 'About', description: 'Meet your website developer.' },
  { href: '/contact', label: 'Contact', description: 'Tell me about your project.' },
  { href: '/blog', label: 'Journal', description: 'Notes on websites and technology.' },
]

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
        <AngularFrame className="web-menu-frame" />
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
              variant="outline"
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
                  <span>
                    <span className="web-mobile-link-title">{item.label}</span>
                    <span className="web-mobile-link-description">{item.description}</span>
                  </span>
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              </DrawerClose>
            ))}
          </nav>
          <div className="web-mobile-menu-bottom">
            <DrawerClose asChild>
              <Link href="/contact" className={cn(buttonVariants({ size: 'lg' }), 'web-cta')}>
                Start a project
                <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </Link>
            </DrawerClose>
            <div className="web-mobile-menu-contact">
              <a href={`mailto:${websiteContent.contact.email}`}>
                <Mail aria-hidden="true" />
                {websiteContent.contact.email}
              </a>
              <a href={`tel:${websiteContent.contact.phoneHref}`}>
                <Phone aria-hidden="true" />
                {websiteContent.contact.phone}
              </a>
              <p>
                <MapPin aria-hidden="true" />
                {websiteContent.contact.location}
              </p>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
