import Link from 'next/link'
import React from 'react'

const LinkToAnalyticsDefaultRootView: React.FC = () => {
  return (
    <Link className="payload-admin-shell__custom-link" href="/admin/analytics">
      <span className="truncate">View Analytics</span>
    </Link>
  )
}

export default LinkToAnalyticsDefaultRootView
