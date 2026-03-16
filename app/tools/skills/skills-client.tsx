"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { PageWrapper } from "@/components/layout/page-wrapper"
import { Card } from "@/components/ui/card"
import { listContainer, listItem } from "@/lib/motion"

const NAVY = "#1a365d"

interface SkillRow {
  companyType: string
  skills: string[]
}

export function SkillsDemandClient({ data }: { data: SkillRow[] }) {
  const sectors = useMemo(
    () => [...new Set(data.map((d) => d.companyType))].sort(),
    [data],
  )

  const [sector, setSector] = useState<string>("all")

  const ranked = useMemo(() => {
    const filtered = sector === "all" ? data : data.filter((d) => d.companyType === sector)
    const counts = new Map<string, number>()
    for (const row of filtered) {
      for (const skill of row.skills) {
        counts.set(skill, (counts.get(skill) ?? 0) + 1)
      }
    }
    return Array.from(counts.entries())
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15)
  }, [data, sector])

  const maxCount = ranked.length > 0 ? ranked[0].count : 1

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold text-[#1a365d]">Skills Demand</h1>
      <p className="mt-1 text-slate-600">
        See which skills are most in-demand right now
      </p>

      <div className="mt-6">
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
      </div>

      <Card className="mt-6 p-6">
        {ranked.length === 0 ? (
          <p className="py-8 text-center text-slate-500">No skill data available</p>
        ) : (
          <motion.div
            className="space-y-3"
            variants={listContainer}
            initial="hidden"
            animate="show"
          >
            {ranked.map((item, i) => (
              <motion.div
                key={item.skill}
                variants={listItem}
                className="flex items-center gap-3"
              >
                <span className="w-6 text-right text-xs font-medium text-slate-400">
                  {i + 1}
                </span>
                <span className="w-32 shrink-0 text-sm font-medium text-slate-700">
                  {item.skill}
                </span>
                <div className="flex-1">
                  <div
                    className="h-6 rounded"
                    style={{
                      width: `${(item.count / maxCount) * 100}%`,
                      backgroundColor: NAVY,
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
                <span className="w-10 text-right text-sm font-semibold text-slate-600">
                  {item.count}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </Card>
    </PageWrapper>
  )
}
