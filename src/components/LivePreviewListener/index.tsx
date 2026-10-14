'use client'
import { getClientSideURL } from '@/lib/getURL'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from '@tanstack/react-router'
import React from 'react'

export const LivePreviewListener: React.FC = () => {
  const router = useRouter()
  return (
    <PayloadLivePreview
      refresh={() => {
        void router.invalidate()
      }}
      serverURL={getClientSideURL()}
    />
  )
}
