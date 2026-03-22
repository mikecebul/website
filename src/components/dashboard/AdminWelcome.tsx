import type { ServerProps } from 'payload'

import Link from 'next/link'

import ShadcnWrapper from '@/components/ShadcnWrapper'

type Props = ServerProps

export default async function AdminWelcome(_props: Props) {
  return (
    <ShadcnWrapper className="pt-4 pb-0">
      <section className="admin-welcome-bar mb-6 flex flex-col gap-4 rounded-2xl border border-white/8 bg-[linear-gradient(135deg,rgba(10,18,36,0.96),rgba(17,25,45,0.88))] px-5 py-4 text-(--marketing-heading) shadow-[0_18px_40px_rgba(0,0,0,0.18)] lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="admin-welcome-bar__eyebrow">Dashboard</p>
          <h2 className="admin-welcome-bar__title">Welcome back, Mike</h2>
          <p className="admin-welcome-bar__copy">
            Keep an eye on traffic and jump into content when you need it.
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <div className="admin-welcome-bar__links">
            <Link className="admin-welcome-bar__link" href="/admin/analytics">
              View analytics
            </Link>
            <Link className="admin-welcome-bar__link" href="/admin/collections/blogs">
              Edit blogs
            </Link>
          </div>
        </div>
      </section>
    </ShadcnWrapper>
  )
}
