"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, Send, SlidersHorizontal } from "lucide-react"
import { PageWrapper } from "@/components/layout/page-wrapper"
import { ChipSelect } from "@/components/preferences/chip-select"
import { SalaryRangeSlider } from "@/components/preferences/salary-range-slider"
import { usePreferences } from "@/lib/hooks/use-preferences"
import { useSavedJobs, useAppliedJobs } from "@/lib/hooks/use-saved-jobs"
import {
  SECTORS,
  SKILLS,
  WORK_ARRANGEMENTS,
  JOB_TYPES,
  SENIORITY_LEVELS,
} from "@/lib/constants"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  const { preferences, setPreferences, resetPreferences, activeFilterCount } =
    usePreferences()
  const { savedIds } = useSavedJobs()
  const { appliedIds } = useAppliedJobs()

  const [resetMessage, setResetMessage] = useState(false)

  function handleReset() {
    resetPreferences()
    setResetMessage(true)
  }

  useEffect(() => {
    if (!resetMessage) return
    const timer = setTimeout(() => setResetMessage(false), 2000)
    return () => clearTimeout(timer)
  }, [resetMessage])

  const stats = [
    {
      label: "Saved Jobs",
      count: savedIds.length,
      icon: Heart,
      href: "/saved",
    },
    {
      label: "Applied",
      count: appliedIds.length,
      icon: Send,
      href: "/applied",
    },
    {
      label: "Active Filters",
      count: activeFilterCount,
      icon: SlidersHorizontal,
      href: undefined,
    },
  ]

  return (
    <PageWrapper>
      <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-normal text-[#1a365d]">Profile</h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage your preferences and view your activity
        </p>
      </div>

      {/* Stats */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          const content = (
            <Card key={stat.label} className="transition-shadow hover:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08)]">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
                  <Icon className="h-5 w-5 text-[#1a365d]" />
                </div>
                <div>
                  <p className="text-2xl font-medium text-[#1a365d]">
                    {stat.count}
                  </p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          )

          if (stat.href) {
            return (
              <Link key={stat.label} href={stat.href}>
                {content}
              </Link>
            )
          }

          return content
        })}
      </div>

      {/* Preferences */}
      <div className="mb-10">
        <h2 className="mb-6 text-xl font-medium text-[#1a365d]">
          Your Preferences
        </h2>

        <div className="space-y-6">
          <ChipSelect
            label="Sectors"
            options={SECTORS}
            selected={preferences.sectors}
            onChange={(sectors) =>
              setPreferences({ ...preferences, sectors })
            }
          />

          <ChipSelect
            label="Skills"
            options={SKILLS}
            selected={preferences.skills}
            onChange={(skills) =>
              setPreferences({ ...preferences, skills })
            }
          />

          <ChipSelect
            label="Work Arrangements"
            options={WORK_ARRANGEMENTS}
            selected={preferences.workArrangements}
            onChange={(workArrangements) =>
              setPreferences({ ...preferences, workArrangements })
            }
          />

          <ChipSelect
            label="Job Types"
            options={JOB_TYPES}
            selected={preferences.jobTypes}
            onChange={(jobTypes) =>
              setPreferences({ ...preferences, jobTypes })
            }
          />

          <ChipSelect
            label="Seniority Levels"
            options={SENIORITY_LEVELS}
            selected={preferences.seniorityLevels}
            onChange={(seniorityLevels) =>
              setPreferences({ ...preferences, seniorityLevels })
            }
          />

          <SalaryRangeSlider
            min={50000}
            max={300000}
            value={[preferences.salaryMin, preferences.salaryMax]}
            onChange={([salaryMin, salaryMax]) =>
              setPreferences({ ...preferences, salaryMin, salaryMax })
            }
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-4">
        <Button variant="destructive" onClick={handleReset}>
          Reset All Preferences
        </Button>
        {resetMessage && (
          <span className="text-sm text-slate-500 animate-in fade-in">
            Preferences cleared
          </span>
        )}
      </div>
      </div>
    </PageWrapper>
  )
}
