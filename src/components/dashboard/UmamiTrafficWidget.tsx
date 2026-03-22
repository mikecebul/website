import type { WidgetServerProps } from 'payload'

import Link from 'next/link'

import ShadcnWrapper from '@/components/ShadcnWrapper'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UmamiTrafficChart } from '@/components/dashboard/UmamiTrafficChart'
import { getUmamiDashboardData } from '@/lib/umami'

const numberFormatter = new Intl.NumberFormat('en-US')

const percentageFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
})

export default async function UmamiTrafficWidget(_props: WidgetServerProps) {
  const analytics = await getUmamiDashboardData()

  return (
    <ShadcnWrapper className="pb-0">
      {!analytics.configured || analytics.error || !analytics.trend.length ? (
        <Card className="border border-dashed border-white/10 bg-[rgba(14,20,37,0.9)] py-0 text-(--marketing-heading)">
          <CardHeader className="py-5">
            <CardTitle className="text-xl tracking-[-0.04em] text-(--marketing-heading)">
              Umami traffic widget
            </CardTitle>
            <CardDescription className="text-(--marketing-copy-soft)">
              {analytics.error ?? 'Configure Umami to render the dashboard chart.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-5 text-sm text-(--marketing-copy-soft)">
            Add `UMAMI_WEBSITE_ID`, `UMAMI_API_CLIENT_ENDPOINT`, `UMAMI_API_CLIENT_USER_ID`, and
            `UMAMI_API_CLIENT_SECRET` to enable this widget.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          <Card className="border border-white/8 bg-[rgba(14,20,37,0.9)] py-0 text-(--marketing-heading) shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
            <CardHeader className="gap-4 py-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="grid gap-1">
                <CardTitle className="text-xl tracking-[-0.04em] text-(--marketing-heading)">
                  Traffic snapshot
                </CardTitle>
                <CardDescription className="text-(--marketing-copy-soft)">
                  Live overview from Umami for the last 30 days.
                </CardDescription>
              </div>
              <Link
                className="text-sm font-medium text-(--marketing-heading) transition-colors hover:text-(--marketing-gold)"
                href="/admin/analytics"
              >
                Open full analytics
              </Link>
            </CardHeader>
            <CardContent className="grid gap-3 pb-5 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-white/8 bg-white/3 px-4 py-3">
                <div className="text-[0.72rem] uppercase tracking-[0.2em] text-(--marketing-copy-soft)">
                  Active now
                </div>
                <div className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-(--marketing-heading)">
                  {numberFormatter.format(analytics.overview?.activeVisitors ?? 0)}
                </div>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/3 px-4 py-3">
                <div className="text-[0.72rem] uppercase tracking-[0.2em] text-(--marketing-copy-soft)">
                  Visitors
                </div>
                <div className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-(--marketing-heading)">
                  {numberFormatter.format(analytics.overview?.visitors ?? 0)}
                </div>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/3 px-4 py-3">
                <div className="text-[0.72rem] uppercase tracking-[0.2em] text-(--marketing-copy-soft)">
                  Pageviews
                </div>
                <div className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-(--marketing-heading)">
                  {numberFormatter.format(analytics.overview?.pageviews ?? 0)}
                </div>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/3 px-4 py-3">
                <div className="text-[0.72rem] uppercase tracking-[0.2em] text-(--marketing-copy-soft)">
                  Bounce rate
                </div>
                <div className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-(--marketing-heading)">
                  {percentageFormatter.format(analytics.overview?.bounceRate ?? 0)}%
                </div>
              </div>
            </CardContent>
          </Card>

          <UmamiTrafficChart data={analytics.trend} />
        </div>
      )}
    </ShadcnWrapper>
  )
}
