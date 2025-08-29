import { withSentryConfig } from '@sentry/nextjs'
import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [`require-in-the-middle`],
  output: process.env.NEXT_OUTPUT === 'standalone' ? 'standalone' : undefined,
  images: {
    remotePatterns: [
      ...[
        baseUrl,
        'https://images.unsplash.com',
        'https://maps.googleapis.com',
        'https://mikecebul.com',
        'https://www.mikecebul.com',
        'https://media.mikecebul.com',
      ].map((item) => {
        const url = new URL(item)
        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
    ],
  },
  reactStrictMode: true,
  redirects,
}

// Sentry Configuration
const sentryConfig = {
  org: 'mikecebul',
  project: 'mikecebul-website',
  sentryUrl: 'https://monitor.mikecebul.com/',
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  reactComponentAnnotation: {
    enabled: true,
  },
  tunnelRoute: '/monitoring',
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
}

export default withSentryConfig(
  withPayload(nextConfig, { devBundleServerPackages: false }),
  sentryConfig,
)
