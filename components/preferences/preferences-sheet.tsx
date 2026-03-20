"use client"

import { X, Sliders } from "lucide-react"
import { track } from "@vercel/analytics"
import { motion, AnimatePresence } from "framer-motion"
import { usePreferences } from "@/lib/hooks/use-preferences"
import {
  SECTORS,
  SKILLS,
  WORK_ARRANGEMENTS,
  JOB_TYPES,
  SENIORITY_LEVELS,
} from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { ChipSelect } from "./chip-select"
import { SalaryRangeSlider } from "./salary-range-slider"
import type { UserPreferences } from "@/lib/types"

interface PreferencesSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  preferences?: UserPreferences
  onPreferencesChange?: (prefs: UserPreferences) => void
  onReset?: () => void
  filterCount?: number
}

export function PreferencesSheet({ open, onOpenChange, preferences: propPreferences, onPreferencesChange, onReset, filterCount }: PreferencesSheetProps) {
  const internal = usePreferences()

  const preferences = propPreferences ?? internal.preferences
  const setPreferences = onPreferencesChange ?? internal.setPreferences
  const resetPreferences = onReset ?? internal.resetPreferences
  const activeFilterCount = filterCount ?? internal.activeFilterCount

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />

          {/* Desktop: right-side sheet */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="fixed inset-y-0 right-0 z-[60] hidden w-[400px] flex-col bg-white shadow-xl md:flex"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div className="flex items-center gap-2.5">
                <Sliders className="size-4 text-[#1a365d]" />
                <h2 className="text-[15px] font-medium text-[#1a365d]">
                  Preferences
                </h2>
                {activeFilterCount > 0 && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-[#d4a038] font-sans text-[11px] font-medium tabular-nums text-white">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
              <p className="text-sm text-slate-500">
                Set your preferences to get personalized job matches and salary
                insights across the platform.
              </p>
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
                label="Work Arrangement"
                options={WORK_ARRANGEMENTS}
                selected={preferences.workArrangements}
                onChange={(workArrangements) =>
                  setPreferences({ ...preferences, workArrangements })
                }
              />
              <ChipSelect
                label="Job Type"
                options={JOB_TYPES}
                selected={preferences.jobTypes}
                onChange={(jobTypes) =>
                  setPreferences({ ...preferences, jobTypes })
                }
              />
              <ChipSelect
                label="Seniority"
                options={SENIORITY_LEVELS}
                selected={preferences.seniorityLevels}
                onChange={(seniorityLevels) =>
                  setPreferences({ ...preferences, seniorityLevels })
                }
              />
              <SalaryRangeSlider
                min={0}
                max={500000}
                value={[preferences.salaryMin, preferences.salaryMax]}
                onChange={([salaryMin, salaryMax]) =>
                  setPreferences({ ...preferences, salaryMin, salaryMax })
                }
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t px-6 py-4">
              <Button variant="ghost" size="sm" onClick={resetPreferences}>
                Reset all
              </Button>
              <Button
                size="sm"
                className="bg-[#1a365d] text-white hover:bg-[#1a365d]/90"
                onClick={() => {
                  track('preferences_updated', { filterCount: activeFilterCount })
                  onOpenChange(false)
                }}
              >
                Done
              </Button>
            </div>
          </motion.div>

          {/* Mobile: bottom drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="fixed inset-x-0 bottom-0 z-[60] flex max-h-[85vh] flex-col rounded-t-2xl bg-white shadow-xl md:hidden"
          >
            {/* Handle */}
            <div className="flex flex-col items-center pb-2 pt-3">
              <div className="h-1.5 w-12 rounded-full bg-slate-300" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3">
              <div className="flex items-center gap-2.5">
                <Sliders className="size-4 text-[#1a365d]" />
                <h2 className="text-[15px] font-medium text-[#1a365d]">
                  Preferences
                </h2>
                {activeFilterCount > 0 && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-[#d4a038] font-sans text-[11px] font-medium tabular-nums text-white">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-6 overflow-y-auto px-5 pb-4">
              <p className="text-sm text-slate-500">
                Set your preferences to get personalized job matches and salary
                insights.
              </p>
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
                label="Work Arrangement"
                options={WORK_ARRANGEMENTS}
                selected={preferences.workArrangements}
                onChange={(workArrangements) =>
                  setPreferences({ ...preferences, workArrangements })
                }
              />
              <ChipSelect
                label="Job Type"
                options={JOB_TYPES}
                selected={preferences.jobTypes}
                onChange={(jobTypes) =>
                  setPreferences({ ...preferences, jobTypes })
                }
              />
              <ChipSelect
                label="Seniority"
                options={SENIORITY_LEVELS}
                selected={preferences.seniorityLevels}
                onChange={(seniorityLevels) =>
                  setPreferences({ ...preferences, seniorityLevels })
                }
              />
              <SalaryRangeSlider
                min={0}
                max={500000}
                value={[preferences.salaryMin, preferences.salaryMax]}
                onChange={([salaryMin, salaryMax]) =>
                  setPreferences({ ...preferences, salaryMin, salaryMax })
                }
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t px-5 py-4">
              <Button variant="ghost" size="sm" onClick={resetPreferences}>
                Reset all
              </Button>
              <Button
                size="sm"
                className="bg-[#1a365d] text-white hover:bg-[#1a365d]/90"
                onClick={() => {
                  track('preferences_updated', { filterCount: activeFilterCount })
                  onOpenChange(false)
                }}
              >
                Done
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
