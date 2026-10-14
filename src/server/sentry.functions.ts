import { createServerFn } from '@tanstack/react-start'

export const checkSentryConfigured = createServerFn({ method: 'GET' }).handler(async () => {
  return Boolean(process.env.SENTRY_DSN)
})
