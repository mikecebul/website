import type { Metadata } from 'next'

import { DM_Sans, Geist } from 'next/font/google'
import type { ReactNode } from 'react'
import { MarketingShell } from '@/components/marketing/marketing-pages'
import { createMarketingMetadata } from '@/lib/marketing-metadata'
import { websiteContent } from '@/lib/website-content'
import './globals.css'
import Script from 'next/script'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
})

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={`${geist.variable} ${dmSans.variable}`} lang="en">
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <Script
          defer
          data-website-id="f3c16b6d-ba74-4792-a21a-a7930138c0f0"
          src="https://analytics.mikecebul.dev/script.js"
          strategy="lazyOnload"
        />
      </head>
      <body>
        <MarketingShell>{children}</MarketingShell>
      </body>
    </html>
  )
}

export const metadata: Metadata = createMarketingMetadata({
  description: websiteContent.site.description,
  pathname: '/',
  title: websiteContent.site.name,
})
