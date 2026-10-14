import { createFileRoute } from '@tanstack/react-router'
import { createMarketingHead } from '@/lib/marketing-metadata'
import { LoginForm } from '@/components/login-form'
import { AngularFrame, PageFrame } from '@/components/marketing/design-system'

function LoginPage() {
  return (
    <PageFrame className="web-account-page">
      <div className="web-container web-panel web-account-panel">
        <AngularFrame />
        <p className="web-eyebrow">Mike Cebulski · Account access</p>
        <LoginForm
          className="web-contact-form"
          heading="Welcome back."
          description="Sign in to manage your account."
          submitLabel="Sign in"
          footerText={
            <>
              Need help accessing your account?{' '}
              <a href="mailto:me@mikecebul.com">Get in touch with Mike.</a>
            </>
          }
        />
      </div>
    </PageFrame>
  )
}

export const Route = createFileRoute('/_marketing/login')({
  head: () =>
    createMarketingHead({
      title: 'Sign in | Mike Cebulski',
      description: 'Sign in to your project account.',
      pathname: '/login',
      noindex: true,
    }),
  component: LoginPage,
})
