import type { ServerProps } from 'payload'

import Link from 'next/link'

import ShadcnWrapper from '@/components/ShadcnWrapper'

type Props = ServerProps

export default async function AdminWelcome(_props: Props) {
  return (
    <ShadcnWrapper className="pt-4 pb-0">
      <section className="admin-welcome-bar mb-6 flex flex-col gap-4 rounded-2xl px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="admin-welcome-bar__eyebrow">Dashboard</p>
          <h2 className="admin-welcome-bar__title">Welcome back, Mike</h2>
          <p className="admin-welcome-bar__copy">
            Keep an eye on traffic and jump into content when you need it.
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <div className="admin-welcome-bar__links">
            <Link className="admin-welcome-bar__link" href="/admin/collections/blogs/create">
              Create new blog
            </Link>
          </div>
        </div>
      </section>
    </ShadcnWrapper>
  )
}
