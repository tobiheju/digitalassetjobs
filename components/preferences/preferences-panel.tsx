"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { spring } from '@/lib/motion'
import { UserPreferences } from '@/lib/types'
import {
  SECTORS,
  SKILLS,
  WORK_ARRANGEMENTS,
  JOB_TYPES,
  SENIORITY_LEVELS,
} from '@/lib/constants'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ChipSelect } from './chip-select'
import { SalaryRangeSlider } from './salary-range-slider'

interface PreferencesPanelProps {
  preferences: UserPreferences
  onChange: (prefs: UserPreferences) => void
  onReset: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

function PanelContent({
  preferences,
  onChange,
  onReset,
  onCloseMobile,
}: {
  preferences: UserPreferences
  onChange: (prefs: UserPreferences) => void
  onReset: () => void
  onCloseMobile?: () => void
}) {
  return (
    <>
      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        <ChipSelect
          label="Sectors"
          options={SECTORS}
          selected={preferences.sectors}
          onChange={(sectors) => onChange({ ...preferences, sectors })}
        />
        <ChipSelect
          label="Skills"
          options={SKILLS}
          selected={preferences.skills}
          onChange={(skills) => onChange({ ...preferences, skills })}
        />
        <ChipSelect
          label="Work Arrangement"
          options={WORK_ARRANGEMENTS}
          selected={preferences.workArrangements}
          onChange={(workArrangements) => onChange({ ...preferences, workArrangements })}
        />
        <ChipSelect
          label="Job Type"
          options={JOB_TYPES}
          selected={preferences.jobTypes}
          onChange={(jobTypes) => onChange({ ...preferences, jobTypes })}
        />
        <ChipSelect
          label="Seniority"
          options={SENIORITY_LEVELS}
          selected={preferences.seniorityLevels}
          onChange={(seniorityLevels) => onChange({ ...preferences, seniorityLevels })}
        />
        <SalaryRangeSlider
          min={0}
          max={500000}
          value={[preferences.salaryMin, preferences.salaryMax]}
          onChange={([salaryMin, salaryMax]) =>
            onChange({ ...preferences, salaryMin, salaryMax })
          }
        />
      </div>
      <div className="sticky bottom-0 flex items-center justify-between border-t bg-white p-4">
        <Button variant="ghost" onClick={onReset}>
          Reset All
        </Button>
        <Button
          className="bg-[#1a365d] text-white hover:bg-[#1a365d]/90"
          onClick={() => onCloseMobile?.()}
        >
          Apply Filters
        </Button>
      </div>
    </>
  )
}

export function PreferencesPanel({
  preferences,
  onChange,
  onReset,
  open,
  onOpenChange,
}: PreferencesPanelProps) {
  return (
    <>
      {/* Desktop: right sidebar */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={spring.gentle}
            className="fixed top-16 right-0 bottom-0 z-40 hidden w-80 flex-col border-l bg-white shadow-lg md:flex"
          >
            <PanelContent
              preferences={preferences}
              onChange={onChange}
              onReset={onReset}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile: bottom sheet */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent side="bottom" showCloseButton={false} className="max-h-[85vh] flex flex-col">
            <SheetHeader className="flex-shrink-0">
              <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-slate-300" />
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <PanelContent
              preferences={preferences}
              onChange={onChange}
              onReset={onReset}
              onCloseMobile={() => onOpenChange(false)}
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
