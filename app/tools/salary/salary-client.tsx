"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Sliders } from "lucide-react"
import { PageWrapper } from "@/components/layout/page-wrapper"
import { PreferencesSheet } from "@/components/preferences/preferences-sheet"
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

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n)
}

function formatK(n: number) {
  return `$${Math.round(n / 1000)}k`
}

const NAVY = "#1a365d"
const GOLD = "#d4a038"

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0.0, 0.0, 0.2, 1] as const },
  },
}

const selectClasses =
  "w-full rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-sm text-slate-700 focus:border-[#1a365d] focus:outline-none focus:ring-1 focus:ring-[#1a365d] appearance-none cursor-pointer"

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
  const [prefsOpen, setPrefsOpen] = useState(false)

  const filtered = useMemo(() => {
    let rows = data.filter((r) => r.salaryMin >= 10000)
    if (sector !== "all") rows = rows.filter((r) => r.companyType === sector)
    if (country !== "all") rows = rows.filter((r) => r.country === country)
    if (seniority !== "all") rows = rows.filter((r) => r.seniority === seniority)
    return rows
  }, [data, sector, country, seniority])

  const stats = useMemo(() => {
    if (filtered.length === 0) return { low: 0, median: 0, high: 0 }
    const midpoints = filtered.map((r) => (r.salaryMin + r.salaryMax) / 2).sort((a, b) => a - b)
    const low = Math.min(...filtered.map((r) => r.salaryMin))
    const high = Math.max(...filtered.map((r) => r.salaryMax))
    const mid = midpoints.length % 2 === 0
      ? Math.round((midpoints[midpoints.length / 2 - 1] + midpoints[midpoints.length / 2]) / 2)
      : Math.round(midpoints[Math.floor(midpoints.length / 2)])
    return { low, median: mid, high }
  }, [filtered])

  const chartData = useMemo(() => {
    const groups = new Map<string, { total: number; count: number; min: number; max: number }>()
    for (const row of filtered) {
      const key = row.companyType
      const existing = groups.get(key) ?? { total: 0, count: 0, min: Infinity, max: -Infinity }
      existing.total += (row.salaryMin + row.salaryMax) / 2
      existing.count += 1
      existing.min = Math.min(existing.min, row.salaryMin)
      existing.max = Math.max(existing.max, row.salaryMax)
      groups.set(key, existing)
    }
    return Array.from(groups.entries())
      .map(([label, { total, count, min, max }]) => ({
        label,
        avg: Math.round(total / count),
        count,
        min,
        max,
      }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 10)
  }, [filtered])

  // Range indicator: position of median between low and high
  const rangePercent =
    stats.high > stats.low
      ? ((stats.median - stats.low) / (stats.high - stats.low)) * 100
      : 50

  return (
    <>
    <PageWrapper>
      {/* Hero */}
      <div className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#1a365d]">
            Salary Calculator
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            See how your compensation compares in digital assets
          </p>
        </div>
        <button
          onClick={() => setPrefsOpen(true)}
          className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-[border-color,box-shadow] duration-150 ease-out hover:border-slate-300 hover:shadow-sm"
        >
          <Sliders className="size-3.5" />
          Personalize
        </button>
      </div>

      {/* Calculator Card */}
      <Card className="mt-10 border border-slate-100/60 rounded-2xl shadow-sm px-6 py-8 md:px-8">
        {/* Filters */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FilterSelect
            label="Sector"
            icon={
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
            }
            value={sector}
            onChange={setSector}
            allLabel="All Sectors"
            options={sectors}
          />
          <FilterSelect
            label="Location"
            icon={
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            }
            value={country}
            onChange={setCountry}
            allLabel="All Locations"
            options={countries}
          />
          <FilterSelect
            label="Seniority"
            icon={
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            }
            value={seniority}
            onChange={setSeniority}
            allLabel="All Levels"
            options={seniorities}
          />
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-slate-100" />

        {/* Results */}
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">
            No salary data for the selected filters
          </p>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-3 gap-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              key={`${sector}-${country}-${seniority}`}
            >
              <motion.div variants={staggerItem} className="text-center">
                <p className="text-xs font-medium text-slate-400">
                  Low
                </p>
                <p className="mt-1 font-sans text-xl font-medium tabular-nums text-slate-600 md:text-2xl">
                  {formatCurrency(stats.low)}
                </p>
              </motion.div>
              <motion.div variants={staggerItem} className="text-center">
                <p className="text-xs font-medium text-[#d4a038]">
                  Median
                </p>
                <p className="mt-1 font-sans text-2xl font-medium tabular-nums text-[#1a365d] md:text-3xl">
                  {formatCurrency(stats.median)}
                </p>
              </motion.div>
              <motion.div variants={staggerItem} className="text-center">
                <p className="text-xs font-medium text-slate-400">
                  High
                </p>
                <p className="mt-1 font-sans text-xl font-medium tabular-nums text-slate-600 md:text-2xl">
                  {formatCurrency(stats.high)}
                </p>
              </motion.div>
            </motion.div>

            <p className="mt-3 text-center text-xs text-slate-400">
              Based on {filtered.length} position{filtered.length !== 1 ? "s" : ""}
            </p>

            {/* Range indicator */}
            <div className="mx-auto mt-6 max-w-md">
              <div className="relative h-2 w-full overflow-hidden rounded-full">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `linear-gradient(to right, #e2e8f0, ${NAVY})`,
                  }}
                />
              </div>
              <div className="relative" style={{ marginTop: -4 }}>
                <div
                  className="absolute -translate-x-1/2"
                  style={{ left: `${rangePercent}%` }}
                >
                  <div
                    className="h-4 w-4 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: GOLD }}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-between text-xs tabular-nums text-slate-400">
                <span>{formatCurrency(stats.low)}</span>
                <span>{formatCurrency(stats.high)}</span>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Sector Comparison Chart */}
      {chartData.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-medium text-[#1a365d]">
            Salary by Sector
          </h2>
          <Card className="border border-slate-100/60 rounded-2xl shadow-sm p-6">
            <div style={{ height: Math.max(300, chartData.length * 44 + 60) }}>
              <ParentSize>
                {({ width, height }) => (
                  <SalaryBarChart data={chartData} width={width} height={height} />
                )}
              </ParentSize>
            </div>
          </Card>
        </div>
      )}
    </PageWrapper>
    <PreferencesSheet open={prefsOpen} onOpenChange={setPrefsOpen} />
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Filter Select                                                      */
/* ------------------------------------------------------------------ */

function FilterSelect({
  label,
  icon,
  value,
  onChange,
  allLabel,
  options,
}: {
  label: string
  icon: React.ReactNode
  value: string
  onChange: (v: string) => void
  allLabel: string
  options: string[]
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-400">
        {icon}
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={selectClasses}
        >
          <option value="all">{allLabel}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Bar Chart with Hover Tooltip                                       */
/* ------------------------------------------------------------------ */

function SalaryBarChart({
  data,
  width,
  height,
}: {
  data: { label: string; avg: number; count: number; min: number; max: number }[]
  width: number
  height: number
}) {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null)

  const margin = { top: 10, right: 50, bottom: 40, left: 150 }
  const xMax = width - margin.left - margin.right
  const yMax = height - margin.top - margin.bottom

  if (xMax <= 0 || yMax <= 0) return null

  const yScale = scaleBand<string>({
    domain: data.map((d) => d.label),
    range: [0, yMax],
    padding: 0.3,
  })

  const xScale = scaleLinear<number>({
    domain: [0, Math.max(...data.map((d) => d.avg)) * 1.15],
    range: [0, xMax],
  })

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        {data.map((d) => {
          const barWidth = xScale(d.avg) ?? 0
          const barHeight = yScale.bandwidth()
          const y = yScale(d.label) ?? 0
          const isHovered = hoveredBar === d.label

          return (
            <g
              key={d.label}
              onMouseEnter={() => setHoveredBar(d.label)}
              onMouseLeave={() => setHoveredBar(null)}
              style={{ cursor: "default" }}
            >
              {/* Invisible hit area */}
              <rect
                x={0}
                y={y}
                width={xMax}
                height={barHeight}
                fill="transparent"
              />
              <Bar
                x={0}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={isHovered ? "#2a4a7f" : NAVY}
                opacity={hoveredBar === null || isHovered ? 1 : 0.6}
                rx={6}
                style={{ transition: "opacity 0.15s ease, fill 0.15s ease" }}
              />
              <text
                x={barWidth + 8}
                y={y + barHeight / 2}
                dy="0.35em"
                fontSize={12}
                fill="#64748b"
                className="tabular-nums"
                style={{ fontFamily: "Instrument Sans, system-ui, sans-serif" }}
              >
                {formatK(d.avg)}
              </text>

              {/* Tooltip */}
              {isHovered && (
                <foreignObject
                  x={Math.min(barWidth + 4, xMax - 180)}
                  y={y - 72}
                  width={200}
                  height={80}
                  style={{ pointerEvents: "none", overflow: "visible" }}
                >
                  <div
                    className="rounded-lg border border-slate-100 bg-white px-3 py-2 shadow-lg"
                    style={{ fontSize: 12 }}
                  >
                    <p className="font-medium text-slate-800">{d.label}</p>
                    <p className="mt-0.5 tabular-nums text-slate-500">
                      Avg: {formatCurrency(d.avg)}
                    </p>
                    <p className="tabular-nums text-slate-500">
                      Range: {formatCurrency(d.min)} &ndash; {formatCurrency(d.max)}
                    </p>
                    <p className="text-slate-400">
                      {d.count} position{d.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                </foreignObject>
              )}
            </g>
          )
        })}
        <AxisLeft
          scale={yScale}
          stroke="#e2e8f0"
          tickStroke="transparent"
          tickLabelProps={() => ({
            fill: "#475569",
            fontSize: 12,
            textAnchor: "end" as const,
            dy: "0.35em",
            dx: -8,
            style: { fontFamily: "Instrument Sans, system-ui, sans-serif" },
          })}
          hideAxisLine
        />
        <AxisBottom
          scale={xScale}
          top={yMax}
          stroke="#e2e8f0"
          tickStroke="transparent"
          tickFormat={(v) => formatK(v as number)}
          tickLabelProps={() => ({
            fill: "#94a3b8",
            fontSize: 11,
            textAnchor: "middle" as const,
            className: "tabular-nums",
            style: { fontFamily: "Instrument Sans, system-ui, sans-serif" },
          })}
          numTicks={5}
        />
      </Group>
    </svg>
  )
}
