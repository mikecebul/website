import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { withPayloadRoot } from '@payloadcms/tanstack-start/client'
import AppError from '@/components/app-error'
import type { ReactNode } from 'react'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    links: [
      { href: '/favicon.ico', rel: 'icon', sizes: '32x32' },
      { href: '/favicon1.svg', rel: 'icon', type: 'image/svg+xml' },
    ],
  }),
  errorComponent: AppError,
  shellComponent: withPayloadRoot(RootDocument),
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html data-scroll-behavior="smooth" lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
