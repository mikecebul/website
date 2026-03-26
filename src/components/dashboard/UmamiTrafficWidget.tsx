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
        <Card className="admin-dashboard-card admin-dashboard-card--empty py-0">
          <CardHeader className="py-5">
            <CardTitle className="text-xl tracking-[-0.04em]">Umami traffic widget</CardTitle>
            <CardDescription>
              {analytics.error ?? 'Configure Umami to render the dashboard chart.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-5 text-sm">
            Add `UMAMI_WEBSITE_ID`, `UMAMI_API_CLIENT_ENDPOINT`, `UMAMI_API_CLIENT_USER_ID`, and
            `UMAMI_API_CLIENT_SECRET` to enable this widget.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          <Card className="admin-dashboard-card py-0">
            <CardHeader className="gap-4 py-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="grid gap-1">
                <CardTitle className="text-xl tracking-[-0.04em]">Traffic snapshot</CardTitle>
                <CardDescription>
                  Live overview from Umami.
                </CardDescription>
              </div>
              <Link className="admin-dashboard-card__link text-sm font-medium transition-colors" href="/admin/analytics">
                Open full analytics
              </Link>
            </CardHeader>
            <CardContent className="grid gap-3 pb-5 sm:grid-cols-2 xl:grid-cols-4">
              <div className="admin-dashboard-stat rounded-xl px-4 py-3">
                <div className="text-[0.72rem] uppercase tracking-[0.2em]">Active now</div>
                <div className="admin-dashboard-stat__value mt-2 text-3xl font-semibold tracking-[-0.05em]">
                  {numberFormatter.format(analytics.overview?.activeVisitors ?? 0)}
                </div>
              </div>
              <div className="admin-dashboard-stat rounded-xl px-4 py-3">
                <div className="text-[0.72rem] uppercase tracking-[0.2em]">Visitors</div>
                <div className="admin-dashboard-stat__value mt-2 text-3xl font-semibold tracking-[-0.05em]">
                  {numberFormatter.format(analytics.overview?.visitors ?? 0)}
                </div>
              </div>
              <div className="admin-dashboard-stat rounded-xl px-4 py-3">
                <div className="text-[0.72rem] uppercase tracking-[0.2em]">Pageviews</div>
                <div className="admin-dashboard-stat__value mt-2 text-3xl font-semibold tracking-[-0.05em]">
                  {numberFormatter.format(analytics.overview?.pageviews ?? 0)}
                </div>
              </div>
              <div className="admin-dashboard-stat rounded-xl px-4 py-3">
                <div className="text-[0.72rem] uppercase tracking-[0.2em]">Bounce rate</div>
                <div className="admin-dashboard-stat__value mt-2 text-3xl font-semibold tracking-[-0.05em]">
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
