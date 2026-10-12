import type { ServerProps, SidebarTabServerProps } from 'payload'
import { Link } from '@payloadcms/ui'
import { Bell } from 'lucide-react'
import { SubmissionInbox } from './SubmissionInbox'

export function NotificationsIcon() {
  return <Bell aria-hidden="true" size={18} strokeWidth={1.7} />
}

export function StudioBrand({ payload }: ServerProps) {
  return (
    <Link
      href={payload.config.routes.admin}
      className="studio-nav-brand"
      aria-label="mikecebul llc dashboard"
    >
      <img src="/favicon1.svg" alt="" width={42} height={42} />
      <strong>mikecebul llc</strong>
    </Link>
  )
}

export function NotificationsTab({ payload }: SidebarTabServerProps) {
  return (
    <SubmissionInbox
      apiRoute={payload.config.routes.api}
      adminRoute={payload.config.routes.admin}
    />
  )
}
