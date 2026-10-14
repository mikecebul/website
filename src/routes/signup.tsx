import appCss from '@/styles.css?url'
import { createMarketingHead } from '@/lib/marketing-metadata'
import { createFileRoute } from '@tanstack/react-router'
import { MarketingShell } from '@/components/marketing/marketing-pages'
import Link from '@/components/router-link'
import { ArrowUpRight } from 'lucide-react'
import { PageFrame, PageHeader, WebsiteAction } from '@/components/marketing/design-system'

function SignupPage() {
  return (
    <PageFrame className="web-not-found">
      <PageHeader
        eyebrow="Account access"
        title={
          <>
            Let’s get you
            <br />
            <span className="web-gold">connected.</span>
          </>
        }
        description="Get in touch with Mike to arrange account access for your project."
      >
        <div className="web-not-found-actions">
          <WebsiteAction href="/contact">Request account access</WebsiteAction>
          <Link className="web-text-link" href="/login">
            Already have an account? Sign in
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </PageHeader>
    </PageFrame>
  )
}

export const Route = createFileRoute('/signup')({
  head: () => {
    const head = createMarketingHead({
      title: 'Account access | Mike Cebulski',
      description: 'Arrange account access for your project.',
      pathname: '/signup',
      noindex: true,
    })
    return { ...head, links: [...head.links, { rel: 'stylesheet', href: appCss }] }
  },
  component: () => (
    <MarketingShell>
      <SignupPage />
    </MarketingShell>
  ),
})
