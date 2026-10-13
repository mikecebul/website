import type { SidebarTabServerProps } from 'payload'
import { Bell } from 'lucide-react'
import { SubmissionInbox } from './SubmissionInbox'

export function NotificationsIcon() {
  return <Bell aria-hidden="true" size={18} strokeWidth={1.7} />
}

export function NotificationsTab({ payload }: SidebarTabServerProps) {
  return (
    <SubmissionInbox
      apiRoute={payload.config.routes.api}
      adminRoute={payload.config.routes.admin}
    />
  )
}
