'use client'

import { PopupList } from '@payloadcms/ui'

export default function AdminQuickLinks() {
  return (
    <PopupList.ButtonGroup>
      <PopupList.Button onClick={() => window.location.assign('/admin/analytics')}>
        Analytics
      </PopupList.Button>
      <PopupList.Button onClick={() => window.location.assign('/')}>Main Website</PopupList.Button>
    </PopupList.ButtonGroup>
  )
}
