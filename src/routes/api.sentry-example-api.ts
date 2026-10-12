import { createFileRoute } from '@tanstack/react-router'
import * as Sentry from '@sentry/node'

class SentryExampleAPIError extends Error {
  constructor() {
    super('This error is raised on the backend called by the example page.')
    this.name = 'SentryExampleAPIError'
  }
}

export const Route = createFileRoute('/api/sentry-example-api')({
  server: {
    handlers: {
      GET: () => {
        const error = new SentryExampleAPIError()
        Sentry.captureException(error)
        throw error
      },
    },
  },
})
