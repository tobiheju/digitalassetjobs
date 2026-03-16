"use client"

import { useMemo, useState } from "react"
import { PageWrapper } from "@/components/layout/page-wrapper"
import { Card } from "@/components/ui/card"
import { ParentSize } from "@visx/responsive"
import { scaleBand, scaleLinear } from "@visx/scale"
import { Bar } from "@visx/shape"
import { Group } from "@visx/group"
import { AxisBottom, AxisLeft } from "@visx/axis"

interface SalaryRow {
  companyType: string
  country: string | null
  seniority: string | null
  salaryMin: number
  salaryMax: number
}

function formatK(n: number) {
  return `$${Math.round(n / 1000)}k`
}

const NAVY = "#1a365d"
const GOLD = "#d69e2e"

export function SalaryExplorerClient({ data }: { data: SalaryRow[] }) {
  const sectors = useMemo(
    () => [...new Set(data.map((d) => d.companyType))].sort(),
    [data],
  )
  const countries = useMemo(
    () =>
      [...new Set(data.map((d) => d.country).filter(Boolean) as string[])].sort(),
    [data],
  )
  const seniorities = useMemo(
    () =>
      [...new Set(data.map((d) => d.seniority).filter(Boolean) as string[])].sort(),
    [data],
  )

  const [sector, setSector] = useState<string>("all")
  const [country, setCountry] = useState<string>("all")
  const [seniority, setSeniority] = useState<string>("all")

  const filtered = useMemo(() => {
    let rows = data
    if (sector !== "all") rows = rows.filter((r) => r.companyType === sector)
    if (country !== "all") rows = rows.filter((r) => r.country === country)
    if (seniority !== "all") rows = rows.filter((r) => r.seniority === seniority)
    return rows
  }, [data, sector, country, seniority])

  const stats = useMemo(() => {
    if (filtered.length === 0) return { min: 0, avg: 0, max: 0 }
    const mins = filtered.map((r) => r.salaryMin)
    const maxes = filtered.map((r) => r.salaryMax)
    const min = Math.min(...mins)
    const max = Math.max(...maxes)
    const avg = Math.round(
      filtered.reduce((s, r) => s + (r.salaryMin + r.salaryMax) / 2, 0) /
        filtered.length,
    )
    return { min, avg, max }
  }, [filtered])

  // Group by the selected dimension for the bar chart
  const chartData = useMemo(() => {
    const groups = new Map<string, { total: number; count: number }>()
    for (const row of filtered) {
      const key = row.companyType
      const existing = groups.get(key) ?? { total: 0, count: 0 }
      existing.total += (row.salaryMin + row.salaryMax) / 2
      existing.count += 1
      groups.set(key, existing)
    }
    return Array.from(groups.entries())
      .map(([label, { total, count }]) => ({
        label,
        avg: Math.round(total / count),
      }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 10)
  }, [filtered])

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold text-[#1a365d]">Salary Explorer</h1>
      <p className="mt-1 text-slate-600">
        Compare salaries by sector, location, and seniority
      </p>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-3">
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="all">All Sectors</option>
          {sectors.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="all">All Countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={seniority}
          onChange={(e) => setSeniority(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="all">All Seniority</option>
          {seniorities.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Min Salary", value: stats.min },
          { label: "Average Salary", value: stats.avg },
          { label: "Max Salary", value: stats.max },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="text-2xl font-bold text-[#1a365d]">
              {filtered.length > 0 ? formatK(s.value) : "---"}
            </p>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card className="mt-6 p-4">
        <h2 className="mb-4 text-lg font-semibold text-[#1a365d]">
          Average Salary by Sector
        </h2>
        {chartData.length === 0 ? (
          <p className="py-8 text-center text-slate-500">
            No salary data for the selected filters
          </p>
        ) : (
          <div style={{ height: Math.max(300, chartData.length * 40 + 60) }}>
            <ParentSize>
              {({ width, height }) => (
                <SalaryBarChart
                  data={chartData}
                  width={width}
                  height={height}
                />
              )}
            </ParentSize>
          </div>
        )}
      </Card>
    </PageWrapper>
  )
}

function SalaryBarChart({
  data,
  width,
  height,
}: {
  data: { label: string; avg: number }[]
  width: number
  height: number
}) {
  const margin = { top: 10, right: 40, bottom: 40, left: 140 }
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom

  if (xMax <= 0 || yMax <= 0) return null

  const yScale = scaleBand<string>({
    domain: data.map((d) => d.label),
    range: [0, yMax],
    padding: 0.3,
  })

  const xScale = scaleLinear<number>({
    domain: [0, Math.max(...data.map((d) => d.avg)) * 1.1],
    range: [0, xMax],
  })

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        {data.map((d) => {
          const barWidth = xScale(d.avg) ?? 0
          const barHeight = yScale.bandwidth()
          const y = yScale(d.label) ?? 0
          return (
            <g key={d.label}>
              <Bar
                x={0}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={NAVY}
                rx={4}
              />
              <text
                x={barWidth + 6}
                y={y + barHeight / 2}
                dy="0.35em"
                fontSize={12}
                fill="#64748b"
              >
                {formatK(d.avg)}
              </text>
            </g>
          )
        })}
        <AxisLeft
          scale={yScale}
          stroke="#e2e8f0"
          tickStroke="#e2e8f0"
          tickLabelProps={() => ({
            fill: "#475569",
            fontSize: 12,
            textAnchor: "end" as const,
            dy: "0.35em",
            dx: -4,
          })}
          hideAxisLine
        />
        <AxisBottom
          scale={xScale}
          top={yMax}
          stroke="#e2e8f0"
          tickStroke="#e2e8f0"
          tickFormat={(v) => formatK(v as number)}
          tickLabelProps={() => ({
            fill: "#475569",
            fontSize: 11,
            textAnchor: "middle" as const,
          })}
          numTicks={5}
        />
      </Group>
    </svg>
  )
}
