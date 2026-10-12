import { createServerFn } from '@tanstack/react-start'

export const checkSentryConnectivity = createServerFn({ method: 'GET' }).handler(async () => {
  if (!process.env.SENTRY_AUTH_TOKEN) return false
  try {
    const response = await fetch('https://monitor.mikecebul.com/api/0/projects/', {
      headers: { Authorization: `Bearer ${process.env.SENTRY_AUTH_TOKEN}` },
    })
    return response.ok
  } catch {
    return false
  }
})
