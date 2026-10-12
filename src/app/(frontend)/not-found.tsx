import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { PageFrame, PageHeader, WebsiteAction } from '@/components/marketing/design-system'

export default function NotFound() {
  return (
    <PageFrame className="web-not-found">
      <PageHeader
        eyebrow="404 · Page not found"
        title={
          <>
            A wrong turn.
            <br />
            <span className="web-gold">An easy way back.</span>
          </>
        }
        description="This page may have moved, or the link may be out of date. Let’s get you where you need to go."
      >
        <div className="web-not-found-actions">
          <WebsiteAction href="/">Back to home</WebsiteAction>
          <Link className="web-text-link" href="/contact">
            Get in touch
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </PageHeader>
    </PageFrame>
  )
}
