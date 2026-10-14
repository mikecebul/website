import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/sentry-tunnel')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const configured = process.env.SENTRY_DSN
        if (!configured) return new Response(null, { status: 204 })
        const dsn = new URL(configured)
        const project = dsn.pathname.split('/').filter(Boolean).at(-1)
        const body = await request.text()
        try {
          const envelope = JSON.parse(body.split('\n')[0]) as { dsn?: string }
          if (envelope.dsn !== configured) return new Response('Invalid envelope', { status: 400 })
          const destination = `${dsn.origin}/api/${project}/envelope/?sentry_version=7&sentry_key=${encodeURIComponent(dsn.username)}`
          const response = await fetch(destination, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-sentry-envelope' },
            body,
          })
          return new Response(null, { status: response.status })
        } catch {
          return new Response('Invalid envelope or unavailable monitoring service', { status: 400 })
        }
      },
    },
  },
})
