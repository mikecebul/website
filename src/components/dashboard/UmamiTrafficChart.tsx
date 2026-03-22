"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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

export function UmamiTrafficChart({ data }: Props) {
  const [timeRange, setTimeRange] = React.useState<keyof typeof ranges>("30d")

  const filteredData = React.useMemo(() => {
    if (!data.length) return data

    const referenceDate = new Date(data[data.length - 1]!.date)
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - ranges[timeRange])

    return data.filter((item) => new Date(item.date) >= startDate)
  }, [data, timeRange])

  return (
    <Card className="overflow-hidden border border-white/8 bg-[rgba(14,20,37,0.9)] py-0 text-(--marketing-heading) shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
      <CardHeader className="border-b border-white/8 py-5 sm:flex-row sm:items-center">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-xl tracking-[-0.04em] text-(--marketing-heading)">
            Traffic trend
          </CardTitle>
          <CardDescription className="text-(--marketing-copy-soft)">
            Pageviews and sessions from Umami over the selected window.
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={(value) => setTimeRange(value as keyof typeof ranges)}>
          <SelectTrigger
            className="mt-2 w-[170px] rounded-full border-white/10 bg-white/4 text-(--marketing-heading) sm:mt-0 sm:ml-auto"
            aria-label="Select a timeframe"
          >
            <SelectValue placeholder="Last 30 days" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border border-white/10 bg-[rgba(18,25,44,0.98)] text-(--marketing-heading)">
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
          className="aspect-auto h-[280px] w-full [&_.recharts-cartesian-grid_line]:stroke-white/8 [&_.recharts-legend-item-text]:text-(--marketing-copy) [&_.recharts-text]:fill-[rgba(209,198,171,0.74)]"
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
              type="natural"
            />
            <Area
              dataKey="pageviews"
              fill="url(#fillPageviews)"
              stroke="var(--color-pageviews)"
              strokeWidth={2}
              type="natural"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
