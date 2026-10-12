import { createFileRoute, Outlet } from '@tanstack/react-router'
import { MarketingShell } from '@/components/marketing/marketing-pages'
import { JsonLd, professionalServiceJsonLd } from '@/components/seo/json-ld'
import NotFoundPage from '@/components/not-found'
import { createMarketingHead } from '@/lib/marketing-metadata'
import { websiteContent } from '@/lib/website-content'
import appCss from '@/styles.css?url'

export const Route = createFileRoute('/_marketing')({
  head: () => ({
    ...createMarketingHead({
      description: websiteContent.site.description,
      pathname: '/',
      title: websiteContent.site.name,
    }),
    links: [{ rel: 'stylesheet', href: appCss }],
    scripts: [
      {
        defer: true,
        'data-website-id': '586c09dc-5042-49ef-a3b1-f72736cae1c3',
        src: 'https://analytics.mikecebul.com/script.js',
      },
    ],
  }),
  component: () => (
    <>
      <JsonLd data={professionalServiceJsonLd} />
      <MarketingShell>
        <Outlet />
      </MarketingShell>
    </>
  ),
  notFoundComponent: NotFoundPage,
})
