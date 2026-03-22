import configPromise from '@payload-config'
import Image from 'next/image'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import type { AdminViewServerProps } from 'payload'
import { formatAdminURL, getSafeRedirect } from 'payload/shared'

import BackToWebsiteLink from '@/components/BackToWebsiteLink'
import ShadcnWrapper from '@/components/ShadcnWrapper'
import { CreateFirstUserForm } from '@/components/create-first-user-form'

export default async function CreateFirstUserView({
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
      <div className="grid h-dvh min-h-dvh w-full overflow-hidden bg-background text-foreground lg:grid-cols-2">
        <div className="flex flex-col gap-4 bg-background p-6 md:p-10">
          <div className="flex justify-center md:justify-start">
            <BackToWebsiteLink />
          </div>

          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm">
              <CreateFirstUserForm
                authCollectionSlug={config.admin.user}
                description="Create the first admin account to unlock the Payload dashboard."
                heading="Create the first admin user"
                loginHref={loginHref}
                redirectTo={redirectTo}
                submitLabel="Create admin account"
              />
            </div>
          </div>
        </div>

        <div className="relative hidden bg-muted lg:block">
          <Image
            src="/login.png"
            alt="Admin setup"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.35] dark:grayscale-[0.15]"
          />
        </div>
      </div>
    </ShadcnWrapper>
  )
}
