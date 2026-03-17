"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { BarChart3, Cpu, Building2, Globe } from "lucide-react"
import { PageWrapper } from "@/components/layout/page-wrapper"
import { ParentSize } from "@visx/responsive"
import { Pie } from "@visx/shape"
import { Group } from "@visx/group"
import { scaleBand, scaleLinear } from "@visx/scale"
import { Bar } from "@visx/shape"
import { AxisBottom, AxisLeft } from "@visx/axis"

const NAVY = "#1a365d"
const GOLD = "#d4a038"

const PALETTE = [
  "#1a365d",
  "#2563eb",
  "#0891b2",
  "#059669",
  "#d4a038",
  "#dc2626",
  "#7c3aed",
  "#db2777",
  "#ea580c",
  "#4f46e5",
  "#0d9488",
  "#84cc16",
]

interface JobRow {
  companyType: string
  country: string | null
  salaryMin: number | null
  skills: string[]
  workArrangement: string
}

function formatK(n: number) {
  return `$${Math.round(n / 1000)}k`
}

/* ------------------------------------------------------------------ */
/*  Tooltip                                                            */
/* ------------------------------------------------------------------ */

function Tooltip({
  x,
  y,
  children,
}: {
  x: number
  y: number
  children: React.ReactNode
}) {
  return (
    <div
      className="pointer-events-none absolute z-10 rounded-lg bg-slate-800 px-3 py-2 text-xs text-white shadow-lg"
      style={{ left: x, top: y }}
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Stat Card                                                          */
/* ------------------------------------------------------------------ */

function StatCard({
  icon: Icon,
  label,
  value,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      className="rounded-xl border border-slate-100/60 bg-white p-5"
    >
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#1a365d]/5">
          <Icon className="size-4 text-[#1a365d]" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="text-xl font-medium tabular-nums text-slate-900">
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function InsightsClient({ data }: { data: JobRow[] }) {
  /* ---------- computed data ---------- */

  const totalPositions = data.length

  const uniqueSkills = useMemo(() => {
    const set = new Set<string>()
    for (const j of data) for (const s of j.skills) set.add(s)
    return set.size
  }, [data])

  const topSector = useMemo(() => {
    const counts = new Map<string, number>()
    for (const j of data)
      counts.set(j.companyType, (counts.get(j.companyType) ?? 0) + 1)
    let best = ""
    let max = 0
    for (const [k, v] of counts) if (v > max) { max = v; best = k }
    return best || "N/A"
  }, [data])

  const countriesCovered = useMemo(() => {
    const set = new Set<string>()
    for (const j of data) if (j.country) set.add(j.country)
    return set.size
  }, [data])

  // 1. Sector breakdown
  const sectorData = useMemo(() => {
    const counts = new Map<string, number>()
    for (const j of data)
      counts.set(j.companyType, (counts.get(j.companyType) ?? 0) + 1)
    return Array.from(counts.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
  }, [data])

  // 2. Top locations
  const locationData = useMemo(() => {
    const counts = new Map<string, number>()
    for (const j of data)
      if (j.country) counts.set(j.country, (counts.get(j.country) ?? 0) + 1)
    return Array.from(counts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }, [data])

  // 3. Salary distribution
  const salaryBuckets = useMemo(() => {
    const buckets = new Map<string, number>()
    for (const j of data) {
      if (j.salaryMin !== null && j.salaryMin > 0) {
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
      if (j.skills && Array.isArray(j.skills)) {
        for (const s of j.skills) {
          if (s && s.trim()) {
            counts.set(s.trim(), (counts.get(s.trim()) ?? 0) + 1)
          }
        }
      }
    }
    return Array.from(counts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }, [data])

  // 5. Work arrangement breakdown
  const arrangementData = useMemo(() => {
    const counts = new Map<string, number>()
    for (const j of data) {
      const wa = j.workArrangement || "Unknown"
      counts.set(wa, (counts.get(wa) ?? 0) + 1)
    }
    return Array.from(counts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
  }, [data])

  return (
    <PageWrapper>
      {/* Hero */}
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-normal text-[#1a365d]">
          Market Insights
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Data-driven overview of the digital asset job market
        </p>
      </div>

      {/* Stat Cards */}
      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={BarChart3} label="Total Positions" value={totalPositions} index={0} />
        <StatCard icon={Cpu} label="Unique Skills" value={uniqueSkills} index={1} />
        <StatCard icon={Building2} label="Top Sector" value={topSector} index={2} />
        <StatCard icon={Globe} label="Countries Covered" value={countriesCovered} index={3} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Sector Breakdown - Donut */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="rounded-xl border border-slate-100/60 bg-white p-5"
        >
          <h2 className="mb-4 text-base font-medium text-[#1a365d]">
            Sector Breakdown
          </h2>
          <div className="relative" style={{ height: 320 }}>
            <ParentSize>
              {({ width, height }) => (
                <DonutChart
                  data={sectorData}
                  width={width}
                  height={height}
                  total={totalPositions}
                />
              )}
            </ParentSize>
          </div>
        </motion.div>

        {/* Top Locations */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="rounded-xl border border-slate-100/60 bg-white p-5"
        >
          <h2 className="mb-4 text-base font-medium text-[#1a365d]">
            Top Locations
          </h2>
          <div className="relative" style={{ height: 320 }}>
            <ParentSize>
              {({ width, height }) => (
                <LocationBarChart
                  data={locationData}
                  width={width}
                  height={height}
                  total={totalPositions}
                />
              )}
            </ParentSize>
          </div>
        </motion.div>

        {/* Salary Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="rounded-xl border border-slate-100/60 bg-white p-5"
        >
          <h2 className="mb-4 text-base font-medium text-[#1a365d]">
            Salary Distribution
          </h2>
          <div className="relative" style={{ height: 320 }}>
            <ParentSize>
              {({ width, height }) => (
                <SalaryBarChart
                  data={salaryBuckets}
                  width={width}
                  height={height}
                />
              )}
            </ParentSize>
          </div>
        </motion.div>

        {/* Skills Frequency */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="rounded-xl border border-slate-100/60 bg-white p-5"
        >
          <h2 className="mb-4 text-base font-medium text-[#1a365d]">
            Top Skills
          </h2>
          <div className="relative" style={{ height: 320 }}>
            <ParentSize>
              {({ width, height }) => (
                <SkillsBarChart
                  data={skillsData}
                  width={width}
                  height={height}
                  total={totalPositions}
                />
              )}
            </ParentSize>
          </div>
        </motion.div>

        {/* Work Arrangement */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="rounded-xl border border-slate-100/60 bg-white p-5 md:col-span-2"
        >
          <h2 className="mb-4 text-base font-medium text-[#1a365d]">
            Work Arrangement
          </h2>
          <WorkArrangementChart data={arrangementData} total={totalPositions} />
        </motion.div>
      </div>
    </PageWrapper>
  )
}

/* ================================================================== */
/*  DONUT CHART                                                        */
/* ================================================================== */

function DonutChart({
  data,
  width,
  height,
  total,
}: {
  data: { label: string; value: number }[]
  width: number
  height: number
  total: number
}) {
  const [hoveredArc, setHoveredArc] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null)

  const chartHeight = height - 60 // reserve space for legend
  const radius = Math.min(width, chartHeight) / 2 - 20
  const innerRadius = radius * 0.55

  if (radius <= 0) return null

  const hovered = data.find((d) => d.label === hoveredArc)

  return (
    <div className="relative">
      <svg width={width} height={chartHeight}>
        <Group top={chartHeight / 2} left={width / 2}>
          <Pie
            data={data}
            pieValue={(d) => d.value}
            outerRadius={radius}
            innerRadius={innerRadius}
            padAngle={0.02}
          >
            {(pie) =>
              pie.arcs.map((arc, i) => {
                const isHovered = arc.data.label === hoveredArc
                const path = pie.path(arc)
                const [cx, cy] = pie.path.centroid(arc)
                return (
                  <g
                    key={arc.data.label}
                    onMouseEnter={(e) => {
                      setHoveredArc(arc.data.label)
                      const rect = (e.currentTarget.closest("svg") as SVGSVGElement).getBoundingClientRect()
                      setTooltip({ x: e.clientX - rect.left + 12, y: e.clientY - rect.top - 10 })
                    }}
                    onMouseMove={(e) => {
                      const rect = (e.currentTarget.closest("svg") as SVGSVGElement).getBoundingClientRect()
                      setTooltip({ x: e.clientX - rect.left + 12, y: e.clientY - rect.top - 10 })
                    }}
                    onMouseLeave={() => {
                      setHoveredArc(null)
                      setTooltip(null)
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <path
                      d={path ?? ""}
                      fill={PALETTE[i % PALETTE.length]}
                      opacity={hoveredArc && !isHovered ? 0.4 : 1}
                      transform={isHovered ? `scale(1.04)` : "scale(1)"}
                      style={{
                        transformOrigin: "center",
                        transition: "transform 150ms ease, opacity 150ms ease",
                      }}
                    />
                    {arc.endAngle - arc.startAngle > 0.4 && (
                      <text
                        x={cx}
                        y={cy}
                        dy="0.35em"
                        fontSize={10}
                        textAnchor="middle"
                        fill="#fff"
                        fontWeight={500}
                        pointerEvents="none"
                      >
                        {arc.data.label.length > 12
                          ? arc.data.label.slice(0, 12) + "…"
                          : arc.data.label}
                      </text>
                    )}
                  </g>
                )
              })
            }
          </Pie>
          {/* Center label */}
          <text
            textAnchor="middle"
            dy="-0.2em"
            fontSize={22}
            fontWeight={500}
            fill={NAVY}
            className="tabular-nums"
          >
            {total}
          </text>
          <text
            textAnchor="middle"
            dy="1.2em"
            fontSize={10}
            fill="#94a3b8"
          >
            positions
          </text>
        </Group>
      </svg>

      {/* Tooltip */}
      {hoveredArc && tooltip && hovered && (
        <Tooltip x={tooltip.x} y={tooltip.y}>
          <p className="font-medium">{hovered.label}</p>
          <p className="text-slate-300">
            {hovered.value} positions ({((hovered.value / total) * 100).toFixed(1)}%)
          </p>
        </Tooltip>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 px-2">
        {data.slice(0, 8).map((d, i) => (
          <div key={d.label} className="flex items-center gap-1.5 text-xs text-slate-600">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
            />
            <span>{d.label}</span>
            <span className="tabular-nums text-slate-400">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ================================================================== */
/*  LOCATION BAR CHART (Horizontal)                                    */
/* ================================================================== */

function LocationBarChart({
  data,
  width,
  height,
  total,
}: {
  data: { label: string; count: number }[]
  width: number
  height: number
  total: number
}) {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null)

  const margin = { top: 5, right: 45, bottom: 10, left: 100 }
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom

  if (xMax <= 0 || yMax <= 0 || data.length === 0) return null

  const yScale = scaleBand<string>({
    domain: data.map((d) => d.label),
    range: [0, yMax],
    padding: 0.3,
  })

  const xScale = scaleLinear<number>({
    domain: [0, Math.max(...data.map((d) => d.count)) * 1.15],
    range: [0, xMax],
  })

  const hovered = data.find((d) => d.label === hoveredBar)

  return (
    <div className="relative">
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          {data.map((d) => {
            const barWidth = xScale(d.count) ?? 0
            const barHeight = yScale.bandwidth()
            const y = yScale(d.label) ?? 0
            const isHovered = d.label === hoveredBar
            return (
              <g
                key={d.label}
                onMouseEnter={(e) => {
                  setHoveredBar(d.label)
                  const rect = (e.currentTarget.closest("svg") as SVGSVGElement).getBoundingClientRect()
                  setTooltip({ x: e.clientX - rect.left + 12, y: e.clientY - rect.top - 10 })
                }}
                onMouseMove={(e) => {
                  const rect = (e.currentTarget.closest("svg") as SVGSVGElement).getBoundingClientRect()
                  setTooltip({ x: e.clientX - rect.left + 12, y: e.clientY - rect.top - 10 })
                }}
                onMouseLeave={() => {
                  setHoveredBar(null)
                  setTooltip(null)
                }}
                style={{ cursor: "pointer" }}
              >
                <Bar
                  x={0}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={NAVY}
                  rx={4}
                  opacity={hoveredBar && !isHovered ? 0.35 : 1}
                  style={{ transition: "opacity 150ms ease" }}
                />
                <text
                  x={barWidth + 6}
                  y={y + barHeight / 2}
                  dy="0.35em"
                  fontSize={11}
                  fill="#64748b"
                  className="tabular-nums"
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
              dx: -6,
            })}
            hideAxisLine
          />
        </Group>
      </svg>

      {hoveredBar && tooltip && hovered && (
        <Tooltip x={tooltip.x} y={tooltip.y}>
          <p className="font-medium">{hovered.label}</p>
          <p className="text-slate-300">
            {hovered.count} positions ({((hovered.count / total) * 100).toFixed(1)}%)
          </p>
        </Tooltip>
      )}
    </div>
  )
}

/* ================================================================== */
/*  SALARY BAR CHART (Vertical)                                        */
/* ================================================================== */

function SalaryBarChart({
  data,
  width,
  height,
}: {
  data: { label: string; count: number }[]
  width: number
  height: number
}) {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null)

  const margin = { top: 10, right: 10, bottom: 60, left: 40 }
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom

  if (xMax <= 0 || yMax <= 0 || data.length === 0) return null

  const xScale = scaleBand<string>({
    domain: data.map((d) => d.label),
    range: [0, xMax],
    padding: 0.25,
  })

  const yScale = scaleLinear<number>({
    domain: [0, Math.max(...data.map((d) => d.count)) * 1.15],
    range: [yMax, 0],
  })

  const maxCount = Math.max(...data.map((d) => d.count))
  const hovered = data.find((d) => d.label === hoveredBar)

  return (
    <div className="relative">
      <svg width={width} height={height}>
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4a038" />
            <stop offset="100%" stopColor="#b8860b" />
          </linearGradient>
        </defs>
        <Group left={margin.left} top={margin.top}>
          {data.map((d) => {
            const barX = xScale(d.label) ?? 0
            const barW = xScale.bandwidth()
            const barH = yMax - (yScale(d.count) ?? 0)
            const barY = yScale(d.count) ?? 0
            const isHovered = d.label === hoveredBar
            const intensity = d.count / maxCount
            return (
              <g
                key={d.label}
                onMouseEnter={(e) => {
                  setHoveredBar(d.label)
                  const rect = (e.currentTarget.closest("svg") as SVGSVGElement).getBoundingClientRect()
                  setTooltip({ x: e.clientX - rect.left + 12, y: e.clientY - rect.top - 10 })
                }}
                onMouseMove={(e) => {
                  const rect = (e.currentTarget.closest("svg") as SVGSVGElement).getBoundingClientRect()
                  setTooltip({ x: e.clientX - rect.left + 12, y: e.clientY - rect.top - 10 })
                }}
                onMouseLeave={() => {
                  setHoveredBar(null)
                  setTooltip(null)
                }}
                style={{ cursor: "pointer" }}
              >
                <Bar
                  x={barX}
                  y={barY}
                  width={barW}
                  height={barH}
                  fill="url(#goldGrad)"
                  rx={3}
                  opacity={hoveredBar && !isHovered ? 0.35 : 0.5 + intensity * 0.5}
                  style={{ transition: "opacity 150ms ease" }}
                />
              </g>
            )
          })}
          <AxisBottom
            scale={xScale}
            top={yMax}
            stroke="#e2e8f0"
            tickStroke="transparent"
            tickLabelProps={() => ({
              fill: "#475569",
              fontSize: 9,
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

      {hoveredBar && tooltip && hovered && (
        <Tooltip x={tooltip.x} y={tooltip.y}>
          <p className="font-medium">{hovered.label}</p>
          <p className="text-slate-300">{hovered.count} positions</p>
        </Tooltip>
      )}
    </div>
  )
}

/* ================================================================== */
/*  SKILLS BAR CHART (Horizontal)                                      */
/* ================================================================== */

function SkillsBarChart({
  data,
  width,
  height,
  total,
}: {
  data: { label: string; count: number }[]
  width: number
  height: number
  total: number
}) {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null)

  const margin = { top: 5, right: 50, bottom: 10, left: 110 }
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom

  if (xMax <= 0 || yMax <= 0 || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-400">
        No skills data available
      </div>
    )
  }

  const yScale = scaleBand<string>({
    domain: data.map((d) => d.label),
    range: [0, yMax],
    padding: 0.25,
  })

  const xScale = scaleLinear<number>({
    domain: [0, Math.max(...data.map((d) => d.count)) * 1.15],
    range: [0, xMax],
  })

  const maxCount = data[0]?.count ?? 1
  const hovered = data.find((d) => d.label === hoveredBar)

  return (
    <div className="relative">
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          {data.map((d, i) => {
            const barWidth = xScale(d.count) ?? 0
            const barHeight = yScale.bandwidth()
            const y = yScale(d.label) ?? 0
            const isHovered = d.label === hoveredBar
            const rankOpacity = 0.5 + ((data.length - i) / data.length) * 0.5
            return (
              <g
                key={d.label}
                onMouseEnter={(e) => {
                  setHoveredBar(d.label)
                  const rect = (e.currentTarget.closest("svg") as SVGSVGElement).getBoundingClientRect()
                  setTooltip({ x: e.clientX - rect.left + 12, y: e.clientY - rect.top - 10 })
                }}
                onMouseMove={(e) => {
                  const rect = (e.currentTarget.closest("svg") as SVGSVGElement).getBoundingClientRect()
                  setTooltip({ x: e.clientX - rect.left + 12, y: e.clientY - rect.top - 10 })
                }}
                onMouseLeave={() => {
                  setHoveredBar(null)
                  setTooltip(null)
                }}
                style={{ cursor: "pointer" }}
              >
                <Bar
                  x={0}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={NAVY}
                  rx={4}
                  opacity={hoveredBar && !isHovered ? 0.25 : rankOpacity}
                  style={{ transition: "opacity 150ms ease" }}
                />
                <text
                  x={barWidth + 6}
                  y={y + barHeight / 2}
                  dy="0.35em"
                  fontSize={11}
                  fill="#64748b"
                  className="tabular-nums"
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
              dx: -6,
            })}
            hideAxisLine
          />
        </Group>
      </svg>

      {hoveredBar && tooltip && hovered && (
        <Tooltip x={tooltip.x} y={tooltip.y}>
          <p className="font-medium">{hovered.label}</p>
          <p className="text-slate-300">
            {hovered.count} positions ({((hovered.count / total) * 100).toFixed(1)}% of all jobs)
          </p>
        </Tooltip>
      )}
    </div>
  )
}

/* ================================================================== */
/*  WORK ARRANGEMENT CHART                                             */
/* ================================================================== */

const ARRANGEMENT_COLORS: Record<string, string> = {
  Remote: "#059669",
  Hybrid: "#2563eb",
  "On-site": "#d4a038",
  Onsite: "#d4a038",
  "In-office": "#d4a038",
  Unknown: "#94a3b8",
}

function WorkArrangementChart({
  data,
  total,
}: {
  data: { label: string; count: number }[]
  total: number
}) {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null)

  if (data.length === 0) {
    return (
      <div className="flex h-20 items-center justify-center text-sm text-slate-400">
        No work arrangement data available
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Stacked bar */}
      <div className="flex h-8 w-full overflow-hidden rounded-lg">
        {data.map((d) => {
          const pct = (d.count / total) * 100
          const color = ARRANGEMENT_COLORS[d.label] ?? "#6b7280"
          const isHovered = d.label === hoveredBar
          return (
            <div
              key={d.label}
              className="relative flex items-center justify-center text-xs font-medium text-white transition-opacity duration-150"
              style={{
                width: `${pct}%`,
                backgroundColor: color,
                opacity: hoveredBar && !isHovered ? 0.4 : 1,
                minWidth: pct > 3 ? undefined : 4,
              }}
              onMouseEnter={() => setHoveredBar(d.label)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              {pct > 10 && (
                <span className="tabular-nums">{pct.toFixed(0)}%</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {data.map((d) => {
          const pct = ((d.count / total) * 100).toFixed(1)
          const color = ARRANGEMENT_COLORS[d.label] ?? "#6b7280"
          const isHovered = d.label === hoveredBar
          return (
            <div
              key={d.label}
              className="flex items-center gap-2 text-sm transition-opacity duration-150"
              style={{ opacity: hoveredBar && !isHovered ? 0.4 : 1 }}
              onMouseEnter={() => setHoveredBar(d.label)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <span
                className="inline-block h-3 w-3 rounded"
                style={{ backgroundColor: color }}
              />
              <span className="text-slate-700">{d.label}</span>
              <span className="tabular-nums text-slate-400">
                {d.count} ({pct}%)
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
