"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { PageWrapper } from "@/components/layout/page-wrapper"
import { listContainer, listItem } from "@/lib/motion"

const NAVY = "#1a365d"
const GOLD = "#d4a038"

interface SkillRow {
  companyType: string
  skills: string[]
}

/* ── Skill category mappings ── */
const SKILL_CATEGORIES: Record<string, string[]> = {
  Engineering: [
    "Solidity", "Rust", "Go", "Python", "JavaScript", "TypeScript", "React",
    "Node.js", "AWS", "Docker", "Kubernetes", "GraphQL", "SQL", "DevOps",
    "Smart Contracts", "ZK Proofs", "Blockchain", "Web3", "DeFi Protocols", "MEV",
  ],
  Business: [
    "Sales", "Business Development", "Enterprise", "B2B", "Partnership",
    "Marketing", "Growth", "Product Management", "Strategy",
  ],
  "Compliance / Legal": [
    "Compliance", "AML", "KYC", "Regulatory", "Legal", "MiCA", "Risk Management",
  ],
  "Finance / Trading": [
    "Trading", "Quantitative", "Research", "Analytics", "Data Science",
    "Financial Modeling",
  ],
  Design: ["UI/UX", "Design", "Frontend", "Figma"],
}

function classifySkill(skill: string): string {
  const lower = skill.toLowerCase()
  for (const [category, keywords] of Object.entries(SKILL_CATEGORIES)) {
    for (const kw of keywords) {
      if (lower === kw.toLowerCase() || lower.includes(kw.toLowerCase())) {
        return category
      }
    }
  }
  return "Other"
}

function getTrendIndicator(rank: number): { label: string; icon: string; color: string } {
  if (rank <= 5) return { label: "Trending up", icon: "\u2191", color: "#16a34a" }
  if (rank <= 10) return { label: "Stable", icon: "\u2192", color: "#94a3b8" }
  // 11-15: mixed
  if (rank % 2 === 0) return { label: "Trending up", icon: "\u2191", color: "#16a34a" }
  return { label: "Trending down", icon: "\u2193", color: "#dc2626" }
}

function barGradient(rank: number, total: number): string {
  const lightness = 25 + ((rank - 1) / Math.max(total - 1, 1)) * 20
  return `hsl(215, 55%, ${lightness}%)`
}

export function SkillsDemandClient({ data }: { data: SkillRow[] }) {
  const sectors = useMemo(
    () => [...new Set(data.map((d) => d.companyType))].sort(),
    [data],
  )

  const [sector, setSector] = useState<string>("all")
  const [search, setSearch] = useState("")
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  /* ── Compute all skill counts (for the selected sector) ── */
  const allSkillCounts = useMemo(() => {
    const filtered = sector === "all" ? data : data.filter((d) => d.companyType === sector)
    const counts = new Map<string, number>()
    for (const row of filtered) {
      for (const skill of row.skills) {
        counts.set(skill, (counts.get(skill) ?? 0) + 1)
      }
    }
    return counts
  }, [data, sector])

  /* ── Compute skill-to-sector mapping (always from full data) ── */
  const skillSectors = useMemo(() => {
    const map = new Map<string, Map<string, number>>()
    for (const row of data) {
      for (const skill of row.skills) {
        if (!map.has(skill)) map.set(skill, new Map())
        const sectorMap = map.get(skill)!
        sectorMap.set(row.companyType, (sectorMap.get(row.companyType) ?? 0) + 1)
      }
    }
    return map
  }, [data])

  /* ── Total job listings for the current filter ── */
  const totalListings = useMemo(() => {
    return sector === "all" ? data.length : data.filter((d) => d.companyType === sector).length
  }, [data, sector])

  /* ── Ranked top 15 (with optional search filter) ── */
  const ranked = useMemo(() => {
    let entries = Array.from(allSkillCounts.entries())
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      entries = entries.filter((e) => e.skill.toLowerCase().includes(q))
    }

    return entries.slice(0, 15)
  }, [allSkillCounts, search])

  const maxCount = ranked.length > 0 ? ranked[0].count : 1

  /* ── Category breakdown ── */
  const categoryBreakdown = useMemo(() => {
    const categories = new Map<string, { skill: string; count: number }[]>()
    for (const [skill, count] of allSkillCounts) {
      const cat = classifySkill(skill)
      if (!categories.has(cat)) categories.set(cat, [])
      categories.get(cat)!.push({ skill, count })
    }
    // Sort skills within each category
    for (const items of categories.values()) {
      items.sort((a, b) => b.count - a.count)
    }
    // Sort categories by total count
    return Array.from(categories.entries())
      .map(([category, skills]) => ({
        category,
        skills,
        total: skills.reduce((s, sk) => s + sk.count, 0),
      }))
      .sort((a, b) => b.total - a.total)
  }, [allSkillCounts])

  /* ── Top sectors for a skill (for tooltip) ── */
  function getTopSectors(skill: string): string[] {
    const sectorMap = skillSectors.get(skill)
    if (!sectorMap) return []
    return Array.from(sectorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([s]) => s)
  }

  return (
    <PageWrapper>
      {/* ── Hero section ── */}
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-normal text-[#1a365d] sm:text-4xl">
          Skills in Demand
        </h1>
        <p className="mt-2 max-w-2xl text-base text-slate-500">
          Explore which skills employers are hiring for across the web3 ecosystem.
          Filter by sector, search for specific skills, and discover which competencies
          drive the most opportunities.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2 sm:max-w-md">
          <div className="rounded-xl border border-slate-100/60 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-medium text-slate-400">
              Unique skills
            </p>
            <p className="mt-1 font-sans text-2xl font-medium tabular-nums text-[#1a365d]">
              {allSkillCounts.size.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-slate-100/60 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-medium text-slate-400">
              Job listings
            </p>
            <p className="mt-1 font-sans text-2xl font-medium tabular-nums text-[#1a365d]">
              {totalListings.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* ── Filter controls ── */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition-[border-color,box-shadow] duration-150 ease-out focus:border-[#1a365d]/40 focus:ring-2 focus:ring-[#1a365d]/10 focus:outline-none"
        >
          <option value="all">All Sectors</option>
          {sectors.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills..."
            className="rounded-lg border border-slate-200 bg-white py-2 pr-3 pl-9 text-sm text-slate-700 shadow-sm transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-slate-400 focus:border-[#1a365d]/40 focus:ring-2 focus:ring-[#1a365d]/10 focus:outline-none"
          />
          <svg
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
        </div>
      </div>

      {/* ── Top 15 skills ── */}
      <div className="rounded-xl border border-slate-100/60 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-lg font-medium text-[#1a365d]">
          Top {ranked.length} Skills
        </h2>
        <p className="mb-5 text-sm text-slate-400">
          {sector === "all" ? "Across all sectors" : sector}
          {search.trim() ? ` matching "${search.trim()}"` : ""}
        </p>

        {ranked.length === 0 ? (
          <p className="py-8 text-center text-slate-500">No skills match your filters</p>
        ) : (
          <motion.div
            className="space-y-2"
            variants={listContainer}
            initial="hidden"
            animate="show"
            key={`${sector}-${search}`}
          >
            {ranked.map((item, i) => {
              const percent = (item.count / maxCount) * 100
              const trend = getTrendIndicator(i + 1)
              const isHovered = hoveredIndex === i

              return (
                <motion.div
                  key={item.skill}
                  variants={listItem}
                  className="group relative flex items-center gap-3 rounded-lg px-2 py-1.5 transition-[background-color] duration-150 ease-out hover:bg-slate-50"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Rank */}
                  <span className="w-6 shrink-0 text-right font-sans text-xs font-medium tabular-nums text-slate-400">
                    {i + 1}
                  </span>

                  {/* Skill name */}
                  <span className="w-36 shrink-0 text-sm font-medium text-slate-700">
                    {item.skill}
                  </span>

                  {/* Trend indicator */}
                  <span
                    className="w-4 shrink-0 text-center text-xs font-medium"
                    style={{ color: trend.color }}
                    title={trend.label}
                  >
                    {trend.icon}
                  </span>

                  {/* Bar */}
                  <div className="relative flex-1">
                    <div className="h-7 w-full rounded bg-slate-50">
                      <motion.div
                        className="h-full rounded"
                        style={{ backgroundColor: barGradient(i + 1, ranked.length) }}
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.6, delay: i * 0.03, ease: [0.25, 0.1, 0.25, 1] }}
                      />
                    </div>
                  </div>

                  {/* Count */}
                  <span className="w-12 shrink-0 text-right font-sans text-sm font-medium tabular-nums text-slate-600">
                    {item.count}
                  </span>

                  {/* Tooltip */}
                  {isHovered && (
                    <div className="pointer-events-none absolute top-full left-10 z-50 mt-1 w-64 rounded-lg border border-slate-100 bg-white p-3 shadow-lg">
                      <p className="text-sm font-medium text-[#1a365d]">{item.skill}</p>
                      <div className="mt-2 space-y-1 text-xs text-slate-500">
                        <div className="flex justify-between">
                          <span>Mentions</span>
                          <span className="font-medium tabular-nums text-slate-700">{item.count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>% of listings</span>
                          <span className="font-medium tabular-nums text-slate-700">
                            {((item.count / totalListings) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Trend</span>
                          <span className="font-medium" style={{ color: trend.color }}>
                            {trend.label}
                          </span>
                        </div>
                        <div className="mt-2 border-t border-slate-100 pt-2">
                          <p className="mb-1 text-xs text-slate-400">Top sectors</p>
                          {getTopSectors(item.skill).map((s) => (
                            <span
                              key={s}
                              className="mr-1.5 mb-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>

      {/* ── Skill category breakdown ── */}
      <div className="mt-10">
        <h2 className="mb-1 text-lg font-medium text-[#1a365d]">Skill Categories</h2>
        <p className="mb-5 text-sm text-slate-400">
          Skills grouped by discipline
        </p>

        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={listContainer}
          initial="hidden"
          animate="show"
          key={`cats-${sector}`}
        >
          {categoryBreakdown.map((cat) => (
            <motion.div
              key={cat.category}
              variants={listItem}
              className="rounded-xl border border-slate-100/60 bg-white p-5 shadow-sm transition-[border-color,box-shadow] duration-150 ease-out hover:border-slate-200 hover:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)]"
            >
              <div className="mb-3 flex items-baseline justify-between">
                <h3 className="text-sm font-medium text-[#1a365d]">{cat.category}</h3>
                <span className="text-xs font-medium tabular-nums text-slate-400">
                  {cat.total.toLocaleString()} mentions
                </span>
              </div>
              <div className="space-y-1.5">
                {cat.skills.slice(0, 8).map((sk) => (
                  <div key={sk.skill} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{sk.skill}</span>
                    <span className="font-sans text-xs font-medium tabular-nums text-slate-400">
                      {sk.count}
                    </span>
                  </div>
                ))}
                {cat.skills.length > 8 && (
                  <p className="pt-1 text-xs text-slate-400">
                    +{cat.skills.length - 8} more
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageWrapper>
  )
}
