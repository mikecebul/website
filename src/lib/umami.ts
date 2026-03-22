import 'server-only'

import { cache } from 'react'
import { getClient } from '@umami/api-client'

const DAY_IN_MS = 24 * 60 * 60 * 1000

type UmamiSeriesPoint = {
  t?: string
  x?: string
  y: number
}

type UmamiPageviewsResponse = {
  pageviews?: UmamiSeriesPoint[]
  sessions?: UmamiSeriesPoint[]
}

type UmamiStatsResponse = {
  bounces?:
    | number
    | {
        prev: number
        value: number
      }
  pageviews?:
    | number
    | {
        prev: number
        value: number
      }
  totaltime?:
    | number
    | {
        prev: number
        value: number
      }
  visits?:
    | number
    | {
        prev: number
        value: number
      }
  visitors?:
    | number
    | {
        prev: number
        value: number
      }
}

export type UmamiTrendPoint = {
  date: string
  pageviews: number
  sessions: number
}

export type UmamiOverview = {
  activeVisitors: number
  bounceRate: number
  pageviews: number
  totalTimeHours: number
  visits: number
  visitors: number
}

export type UmamiDashboardData = {
  configured: boolean
  error?: string
  overview: UmamiOverview | null
  websiteId: string | null
  trend: UmamiTrendPoint[]
}

type UmamiActiveResponse = {
  visitors?: number
  x?: number
}

const getDateRange = (days: number) => {
  const endAt = Date.now()
  const startAt = endAt - days * DAY_IN_MS

  return { endAt, startAt }
}

const mergeSeries = (pageviews: UmamiSeriesPoint[] = [], sessions: UmamiSeriesPoint[] = []) => {
  const merged = new Map<string, UmamiTrendPoint>()

  for (const point of pageviews) {
    const date = point.t ?? point.x

    if (!date) continue

    merged.set(date, {
      date,
      pageviews: point.y,
      sessions: merged.get(date)?.sessions ?? 0,
    })
  }

  for (const point of sessions) {
    const date = point.t ?? point.x

    if (!date) continue

    merged.set(date, {
      date,
      pageviews: merged.get(date)?.pageviews ?? 0,
      sessions: point.y,
    })
  }

  return Array.from(merged.values()).sort((a, b) => a.date.localeCompare(b.date))
}

const toOverview = (
  stats: UmamiStatsResponse | undefined,
  activeVisitors: number,
): UmamiOverview => {
  const getMetricValue = (
    metric:
      | number
      | {
          prev: number
          value: number
        }
      | undefined,
  ) => {
    if (typeof metric === 'number') return metric
    return metric?.value ?? 0
  }

  const visitsValue = getMetricValue(stats?.visits)
  const bounces = getMetricValue(stats?.bounces)

  return {
    activeVisitors,
    bounceRate: visitsValue > 0 ? (bounces / visitsValue) * 100 : 0,
    pageviews: getMetricValue(stats?.pageviews),
    totalTimeHours: getMetricValue(stats?.totaltime) / 60 / 60,
    visits: visitsValue,
    visitors: getMetricValue(stats?.visitors),
  }
}

const createClient = () =>
  getClient({
    apiEndpoint: process.env.UMAMI_API_CLIENT_ENDPOINT,
    apiKey: process.env.UMAMI_API_KEY,
    secret: process.env.UMAMI_API_CLIENT_SECRET,
    userId: process.env.UMAMI_API_CLIENT_USER_ID,
  })

export const getUmamiDashboardData = cache(async (): Promise<UmamiDashboardData> => {
  const websiteId = process.env.UMAMI_WEBSITE_ID ?? null
  const endpoint = process.env.UMAMI_API_CLIENT_ENDPOINT
  const hasCloudKey = Boolean(process.env.UMAMI_API_KEY)
  const hasSelfHostedAuth = Boolean(
    process.env.UMAMI_API_CLIENT_USER_ID && process.env.UMAMI_API_CLIENT_SECRET,
  )

  if (!websiteId || !endpoint || (!hasCloudKey && !hasSelfHostedAuth)) {
    return {
      configured: false,
      error:
        'Add UMAMI_WEBSITE_ID plus either UMAMI_API_KEY or UMAMI_API_CLIENT_USER_ID and UMAMI_API_CLIENT_SECRET.',
      overview: null,
      trend: [],
      websiteId,
    }
  }

  const client = createClient()
  const { endAt, startAt } = getDateRange(90)
  const statsRange = getDateRange(30)
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Detroit'

  try {
    const [activeResult, pageviewsResult, statsResult] = await Promise.all([
      client.getWebsiteActive(websiteId),
      client.getWebsitePageviews(websiteId, {
        endAt,
        startAt,
        timezone,
        unit: 'day',
      }),
      client.getWebsiteStats(websiteId, {
        endAt: statsRange.endAt,
        startAt: statsRange.startAt,
      }),
    ])

    if (!pageviewsResult.ok || !statsResult.ok) {
      return {
        configured: true,
        error: 'Unable to load Umami analytics right now.',
        overview: null,
        trend: [],
        websiteId,
      }
    }

    const pageviewsData = (pageviewsResult.data ?? {}) as UmamiPageviewsResponse
    const statsData = (statsResult.data ?? {}) as UmamiStatsResponse
    const activeData = (activeResult.data ?? {}) as UmamiActiveResponse
    const activeVisitors =
      typeof activeData.visitors === 'number'
        ? activeData.visitors
        : typeof activeData.x === 'number'
          ? activeData.x
          : 0

    return {
      configured: true,
      overview: toOverview(statsData, activeVisitors),
      trend: mergeSeries(pageviewsData.pageviews, pageviewsData.sessions),
      websiteId,
    }
  } catch {
    return {
      configured: true,
      error: 'Unable to connect to Umami.',
      overview: null,
      trend: [],
      websiteId,
    }
  }
})
