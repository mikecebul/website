import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { PageFrame, PageHeader, WebsiteAction } from '@/components/marketing/design-system'

export default function SignupPage() {
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
