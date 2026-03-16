"use client"

import { useMemo } from "react"
import { PageWrapper } from "@/components/layout/page-wrapper"
import { Card } from "@/components/ui/card"
import { ParentSize } from "@visx/responsive"
import { Pie } from "@visx/shape"
import { Group } from "@visx/group"
import { scaleBand, scaleLinear } from "@visx/scale"
import { Bar } from "@visx/shape"
import { AxisBottom, AxisLeft } from "@visx/axis"

const NAVY = "#1a365d"
const GOLD = "#d69e2e"

const COLORS = [
  "#1a365d",
  "#2a4a7f",
  "#3b82f6",
  "#60a5fa",
  "#93c5fd",
  "#d69e2e",
  "#f59e0b",
  "#fbbf24",
  "#a78bfa",
  "#c084fc",
]

interface JobRow {
  companyType: string
  country: string | null
  salaryMin: number | null
  skills: string[]
}

function formatK(n: number) {
  return `$${Math.round(n / 1000)}k`
}

export function InsightsClient({ data }: { data: JobRow[] }) {
  // 1. Sector breakdown
  const sectorData = useMemo(() => {
    const counts = new Map<string, number>()
    for (const j of data) {
      counts.set(j.companyType, (counts.get(j.companyType) ?? 0) + 1)
    }
    return Array.from(counts.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
  }, [data])

  // 2. Top locations
  const locationData = useMemo(() => {
    const counts = new Map<string, number>()
    for (const j of data) {
      if (j.country) {
        counts.set(j.country, (counts.get(j.country) ?? 0) + 1)
      }
    }
    return Array.from(counts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }, [data])

  // 3. Salary distribution
  const salaryBuckets = useMemo(() => {
    const buckets = new Map<string, number>()
    for (const j of data) {
      if (j.salaryMin !== null) {
        const bucket = Math.floor(j.salaryMin / 50000) * 50000
        const label = `${formatK(bucket)}-${formatK(bucket + 50000)}`
        buckets.set(label, (buckets.get(label) ?? 0) + 1)
      }
    }
    return Array.from(buckets.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => {
        const aNum = parseInt(a.label.replace(/[^0-9]/g, ""))
        const bNum = parseInt(b.label.replace(/[^0-9]/g, ""))
        return aNum - bNum
      })
  }, [data])

  // 4. Skills frequency
  const skillsData = useMemo(() => {
    const counts = new Map<string, number>()
    for (const j of data) {
      for (const s of j.skills) {
        counts.set(s, (counts.get(s) ?? 0) + 1)
      }
    }
    return Array.from(counts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }, [data])

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold text-[#1a365d]">Market Insights</h1>
      <p className="mt-1 text-slate-600">
        Data-driven view of the digital asset job market
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Sector Breakdown - Donut */}
        <Card className="p-4">
          <h2 className="mb-2 text-lg font-semibold text-[#1a365d]">
            Sector Breakdown
          </h2>
          <div style={{ height: 300 }}>
            <ParentSize>
              {({ width, height }) => (
                <DonutChart data={sectorData} width={width} height={height} />
              )}
            </ParentSize>
          </div>
        </Card>

        {/* Top Locations - Horizontal Bar */}
        <Card className="p-4">
          <h2 className="mb-2 text-lg font-semibold text-[#1a365d]">
            Top Locations
          </h2>
          <div style={{ height: 300 }}>
            <ParentSize>
              {({ width, height }) => (
                <HorizontalBarChart
                  data={locationData}
                  width={width}
                  height={height}
                  color={NAVY}
                />
              )}
            </ParentSize>
          </div>
        </Card>

        {/* Salary Distribution - Vertical Bars */}
        <Card className="p-4">
          <h2 className="mb-2 text-lg font-semibold text-[#1a365d]">
            Salary Distribution
          </h2>
          <div style={{ height: 300 }}>
            <ParentSize>
              {({ width, height }) => (
                <VerticalBarChart
                  data={salaryBuckets}
                  width={width}
                  height={height}
                  color={GOLD}
                />
              )}
            </ParentSize>
          </div>
        </Card>

        {/* Skills Frequency - Horizontal Bar */}
        <Card className="p-4">
          <h2 className="mb-2 text-lg font-semibold text-[#1a365d]">
            Skills Frequency
          </h2>
          <div style={{ height: 300 }}>
            <ParentSize>
              {({ width, height }) => (
                <HorizontalBarChart
                  data={skillsData}
                  width={width}
                  height={height}
                  color={NAVY}
                />
              )}
            </ParentSize>
          </div>
        </Card>
      </div>
    </PageWrapper>
  )
}

// ---------- Chart components ----------

function DonutChart({
  data,
  width,
  height,
}: {
  data: { label: string; value: number }[]
  width: number
  height: number
}) {
  const radius = Math.min(width, height) / 2 - 20
  const innerRadius = radius * 0.55

  if (radius <= 0) return null

  return (
    <svg width={width} height={height}>
      <Group top={height / 2} left={width / 2}>
        <Pie
          data={data}
          pieValue={(d) => d.value}
          outerRadius={radius}
          innerRadius={innerRadius}
          padAngle={0.02}
        >
          {(pie) =>
            pie.arcs.map((arc, i) => {
              const path = pie.path(arc)
              // Centroid for label
              const [cx, cy] = pie.path.centroid(arc)
              const hasSpace = arc.endAngle - arc.startAngle > 0.3
              return (
                <g key={arc.data.label}>
                  <path d={path ?? ""} fill={COLORS[i % COLORS.length]} />
                  {hasSpace && (
                    <text
                      x={cx}
                      y={cy}
                      dy="0.35em"
                      fontSize={11}
                      textAnchor="middle"
                      fill="#fff"
                      fontWeight={600}
                    >
                      {arc.data.label.length > 10
                        ? arc.data.label.slice(0, 10) + "..."
                        : arc.data.label}
                    </text>
                  )}
                </g>
              )
            })
          }
        </Pie>
      </Group>
    </svg>
  )
}

function HorizontalBarChart({
  data,
  width,
  height,
  color,
}: {
  data: { label: string; count: number }[]
  width: number
  height: number
  color: string
}) {
  const margin = { top: 5, right: 40, bottom: 20, left: 100 }
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom

  if (xMax <= 0 || yMax <= 0 || data.length === 0) return null

  const yScale = scaleBand<string>({
    domain: data.map((d) => d.label),
    range: [0, yMax],
    padding: 0.3,
  })

  const xScale = scaleLinear<number>({
    domain: [0, Math.max(...data.map((d) => d.count)) * 1.1],
    range: [0, xMax],
  })

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        {data.map((d) => {
          const barWidth = xScale(d.count) ?? 0
          const barHeight = yScale.bandwidth()
          const y = yScale(d.label) ?? 0
          return (
            <g key={d.label}>
              <Bar
                x={0}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={color}
                rx={3}
              />
              <text
                x={barWidth + 4}
                y={y + barHeight / 2}
                dy="0.35em"
                fontSize={11}
                fill="#64748b"
              >
                {d.count}
              </text>
            </g>
          )
        })}
        <AxisLeft
          scale={yScale}
          stroke="transparent"
          tickStroke="transparent"
          tickLabelProps={() => ({
            fill: "#475569",
            fontSize: 11,
            textAnchor: "end" as const,
            dy: "0.35em",
            dx: -4,
          })}
          hideAxisLine
        />
      </Group>
    </svg>
  )
}

function VerticalBarChart({
  data,
  width,
  height,
  color,
}: {
  data: { label: string; count: number }[]
  width: number
  height: number
  color: string
}) {
  const margin = { top: 10, right: 10, bottom: 60, left: 40 }
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom

  if (xMax <= 0 || yMax <= 0 || data.length === 0) return null

  const xScale = scaleBand<string>({
    domain: data.map((d) => d.label),
    range: [0, xMax],
    padding: 0.2,
  })

  const yScale = scaleLinear<number>({
    domain: [0, Math.max(...data.map((d) => d.count)) * 1.1],
    range: [yMax, 0],
  })

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        {data.map((d) => {
          const barX = xScale(d.label) ?? 0
          const barW = xScale.bandwidth()
          const barH = yMax - (yScale(d.count) ?? 0)
          const barY = yScale(d.count) ?? 0
          return (
            <Bar
              key={d.label}
              x={barX}
              y={barY}
              width={barW}
              height={barH}
              fill={color}
              rx={3}
            />
          )
        })}
        <AxisBottom
          scale={xScale}
          top={yMax}
          stroke="#e2e8f0"
          tickStroke="transparent"
          tickLabelProps={() => ({
            fill: "#475569",
            fontSize: 10,
            textAnchor: "end" as const,
            angle: -45,
            dx: -4,
            dy: -2,
          })}
        />
        <AxisLeft
          scale={yScale}
          stroke="#e2e8f0"
          tickStroke="transparent"
          tickLabelProps={() => ({
            fill: "#475569",
            fontSize: 11,
            textAnchor: "end" as const,
            dy: "0.35em",
            dx: -4,
          })}
          numTicks={5}
          hideAxisLine
        />
      </Group>
    </svg>
  )
}
