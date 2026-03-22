import configPromise from '@payload-config'
import Image from 'next/image'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import type { AdminViewServerProps } from 'payload'
import { formatAdminURL, getSafeRedirect } from 'payload/shared'
import { Shield } from 'lucide-react'

import ShadcnWrapper from '@/components/ShadcnWrapper'
import { LoginForm } from '@/components/login-form'

export default async function LoginView({ initPageResult, searchParams }: AdminViewServerProps) {
  const {
    req: {
      payload: { config },
    },
  } = initPageResult

  const forgotPasswordHref = formatAdminURL({
    adminRoute: config.routes.admin,
    path: config.admin.routes.forgot,
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
          <div className="flex justify-center gap-2 md:justify-start">
            <Link href="/" className="flex items-center gap-3 font-medium no-underline">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Shield className="size-5" />
              </div>
              <div className="leading-none">
                <div className="text-xl font-semibold">MIKECEBUL Admin</div>
              </div>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm">
              <LoginForm
                forgotPasswordHref={forgotPasswordHref}
                footerText={null}
                heading="Login to your account"
                redirectTo={redirectTo}
                submitLabel="Login"
              />
            </div>
          </div>
        </div>

        <div className="relative hidden bg-muted lg:block">
          <Image
            src="/login.png"
            alt="Login"
            fill
            priority
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.35] dark:grayscale-[0.15]"
          />
        </div>
      </div>
    </ShadcnWrapper>
  )
}
