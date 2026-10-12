import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { StartClient } from '@tanstack/react-start/client'
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  enabled: Boolean(import.meta.env.VITE_SENTRY_DSN),
  tunnel: '/api/sentry-tunnel',
})
hydrateRoot(
  document,
  <StrictMode>
    <StartClient />
  </StrictMode>,
)
