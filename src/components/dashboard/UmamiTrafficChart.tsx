"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { UmamiTrendPoint } from "@/lib/umami"

const chartConfig = {
  pageviews: {
    color: "var(--marketing-gold)",
    label: "Pageviews",
  },
  sessions: {
    color: "var(--marketing-sky)",
    label: "Sessions",
  },
} satisfies ChartConfig

type Props = {
  data: UmamiTrendPoint[]
}

const ranges = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
} as const

const formatYAxisTick = (value: number) =>
  new Intl.NumberFormat("en-US", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value)

const MS_IN_DAY = 24 * 60 * 60 * 1000

const toDateKey = (value: string | Date) => {
  const date = typeof value === "string" ? new Date(value) : value
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  const day = String(date.getUTCDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function UmamiTrafficChart({ data }: Props) {
  const [timeRange, setTimeRange] = React.useState<keyof typeof ranges>("30d")

  const filteredData = React.useMemo(() => {
    if (!data.length) return data

    const pointByDate = new Map(data.map((item) => [toDateKey(item.date), item]))
    const referenceDate = new Date(data[data.length - 1]!.date)
    const startDate = new Date(referenceDate)
    startDate.setUTCDate(startDate.getUTCDate() - (ranges[timeRange] - 1))

    return Array.from({ length: ranges[timeRange] }, (_, index) => {
      const currentDate = new Date(startDate.getTime() + index * MS_IN_DAY)
      const dateKey = toDateKey(currentDate)
      const existingPoint = pointByDate.get(dateKey)

      return existingPoint ?? {
        date: currentDate.toISOString(),
        pageviews: 0,
        sessions: 0,
      }
    })
  }, [data, timeRange])

  return (
    <Card className="admin-dashboard-card overflow-hidden py-0">
      <CardHeader className="admin-dashboard-card__header py-5 sm:flex-row sm:items-center">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-xl tracking-[-0.04em]">Traffic trend</CardTitle>
          <CardDescription>
            Pageviews and sessions from Umami over the selected window.
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={(value) => setTimeRange(value as keyof typeof ranges)}>
          <SelectTrigger className="admin-dashboard-chart__trigger mt-2 w-[170px] rounded-full sm:mt-0 sm:ml-auto" aria-label="Select a timeframe">
            <SelectValue placeholder="Last 30 days" />
          </SelectTrigger>
          <SelectContent
            align="end"
            alignItemWithTrigger={false}
            className="admin-dashboard-chart__menu rounded-xl"
            sideOffset={8}
          >
            <SelectItem value="90d" className="rounded-lg">
              Last 90 days
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="admin-dashboard-chart aspect-auto h-[280px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillPageviews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-pageviews)" stopOpacity={0.7} />
                <stop offset="95%" stopColor="var(--color-pageviews)" stopOpacity={0.08} />
              </linearGradient>
              <linearGradient id="fillSessions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-sessions)" stopOpacity={0.5} />
                <stop offset="95%" stopColor="var(--color-sessions)" stopOpacity={0.06} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="date"
              minTickGap={32}
              tickLine={false}
              tickMargin={10}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                })
              }
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              domain={[0, "auto"]}
              tickFormatter={formatYAxisTick}
              tickLine={false}
              tickMargin={10}
              width={44}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                    })
                  }
                />
              }
            />
            <Area
              dataKey="sessions"
              fill="url(#fillSessions)"
              stroke="var(--color-sessions)"
              strokeWidth={2}
              type="monotone"
            />
            <Area
              dataKey="pageviews"
              fill="url(#fillPageviews)"
              stroke="var(--color-pageviews)"
              strokeWidth={2}
              type="monotone"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
