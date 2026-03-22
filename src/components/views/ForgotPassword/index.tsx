import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import type { AdminViewServerProps } from 'payload'
import { formatAdminURL, getSafeRedirect } from 'payload/shared'

import BackToWebsiteLink from '@/components/BackToWebsiteLink'
import ShadcnWrapper from '@/components/ShadcnWrapper'
import { ForgotPasswordForm } from '@/components/forgot-password-form'

export default async function ForgotPasswordView({
  initPageResult,
  searchParams,
}: AdminViewServerProps) {
  const {
    req: {
      payload: { config },
    },
  } = initPageResult

  const loginHref = formatAdminURL({
    adminRoute: config.routes.admin,
    path: config.admin.routes.login,
  })
  const requestedRedirect =
    typeof searchParams?.redirect === 'string' ? searchParams.redirect : ''
  const redirectTo = getSafeRedirect({
    fallbackTo: config.routes.admin,
    redirectTo: requestedRedirect,
  })
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (user) {
    redirect(redirectTo)
  }

  return (
    <ShadcnWrapper className="pb-0">
      <div className="flex min-h-dvh w-full flex-col bg-background text-foreground">
        <div className="flex justify-center p-6 md:justify-start md:p-10">
          <BackToWebsiteLink />
        </div>

          <div className="flex flex-1 items-center justify-center px-6 pb-10 md:px-10">
            <div className="w-full max-w-md">
              <ForgotPasswordForm loginHref={loginHref} />
            </div>
          </div>
        </div>
    </ShadcnWrapper>
  )
}
