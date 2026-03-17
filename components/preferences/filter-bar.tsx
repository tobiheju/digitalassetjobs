'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, X, SlidersHorizontal, BadgeCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { UserPreferences } from '@/lib/types'
import {
  SECTORS,
  SKILLS,
  WORK_ARRANGEMENTS,
  JOB_TYPES,
  SENIORITY_LEVELS,
} from '@/lib/constants'

interface FilterBarProps {
  preferences: UserPreferences
  onChange: (prefs: UserPreferences) => void
  onReset: () => void
  activeFilterCount: number
}

// ---------------------------------------------------------------------------
// Dropdown filter component
// ---------------------------------------------------------------------------

function FilterDropdown({
  label,
  options,
  selected,
  onChange,
}: {
  label: string
  options: readonly string[]
  selected: string[]
  onChange: (val: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick)
      return () => document.removeEventListener('mousedown', handleClick)
    }
  }, [open])

  const toggle = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((s) => s !== val))
    } else {
      onChange([...selected, val])
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-[color,background-color,border-color,scale] duration-150 ease-out active:scale-[0.96]',
          selected.length > 0
            ? 'border-[#1a365d]/20 bg-[#1a365d]/5 text-[#1a365d]'
            : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
        )}
      >
        {label}
        {selected.length > 0 && (
          <span className="flex size-4 items-center justify-center rounded-full bg-[#1a365d] text-[10px] font-medium text-white">
            {selected.length}
          </span>
        )}
        <ChevronDown className={cn('size-3.5 transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-30 mt-1.5 w-56 rounded-2xl bg-white p-2 shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_4px_8px_-2px_rgba(0,0,0,0.1),0_8px_16px_-4px_rgba(0,0,0,0.08)]"
          >
            <div className="max-h-64 overflow-y-auto">
              {options.map((option) => {
                const isSelected = selected.includes(option)
                return (
                  <button
                    key={option}
                    onClick={() => toggle(option)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] transition-colors',
                      isSelected
                        ? 'bg-[#1a365d]/5 font-medium text-[#1a365d]'
                        : 'text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    <div
                      className={cn(
                        'flex size-4 items-center justify-center rounded border transition-colors',
                        isSelected
                          ? 'border-[#1a365d] bg-[#1a365d]'
                          : 'border-slate-300'
                      )}
                    >
                      {isSelected && (
                        <svg className="size-3 text-white" viewBox="0 0 12 12" fill="none">
                          <path d="M3 6l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    {option}
                  </button>
                )
              })}
            </div>
            {selected.length > 0 && (
              <div className="mt-1 border-t pt-1">
                <button
                  onClick={() => onChange([])}
                  className="w-full rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-slate-400 hover:text-slate-600"
                >
                  Clear {label.toLowerCase()}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main filter bar
// ---------------------------------------------------------------------------

export function FilterBar({
  preferences,
  onChange,
  onReset,
  activeFilterCount,
}: FilterBarProps) {
  const [showAll, setShowAll] = useState(false)

  return (
    <div className="space-y-2">
      {/* Primary filters row */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterDropdown
          label="Sector"
          options={SECTORS}
          selected={preferences.sectors}
          onChange={(sectors) => onChange({ ...preferences, sectors })}
        />
        <FilterDropdown
          label="Skills"
          options={SKILLS}
          selected={preferences.skills}
          onChange={(skills) => onChange({ ...preferences, skills })}
        />
        <FilterDropdown
          label="Work Type"
          options={WORK_ARRANGEMENTS}
          selected={preferences.workArrangements}
          onChange={(workArrangements) => onChange({ ...preferences, workArrangements })}
        />

        {/* Verified only toggle */}
        <button
          onClick={() => onChange({ ...preferences, verifiedOnly: !preferences.verifiedOnly })}
          className={cn(
            'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-[color,background-color,border-color,scale] duration-150 ease-out active:scale-[0.96]',
            preferences.verifiedOnly
              ? 'border-blue-200 bg-blue-50 text-blue-700'
              : 'border-slate-200 text-slate-500 hover:border-slate-300'
          )}
        >
          <BadgeCheck className="size-3.5" />
          Verified
        </button>

        {/* More filters toggle */}
        <button
          onClick={() => setShowAll(!showAll)}
          className={cn(
            'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-[color,background-color,border-color,scale] duration-150 ease-out active:scale-[0.96]',
            showAll
              ? 'border-slate-300 bg-slate-50 text-slate-700'
              : 'border-slate-200 text-slate-500 hover:border-slate-300'
          )}
        >
          <SlidersHorizontal className="size-3.5" />
          More
        </button>

        {/* Clear all */}
        {activeFilterCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-[13px] font-medium text-slate-400 hover:text-slate-600"
          >
            <X className="size-3.5" />
            Clear all
          </button>
        )}
      </div>

      {/* Expanded filters row */}
      <AnimatePresence>
        {showAll && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <FilterDropdown
                label="Job Type"
                options={JOB_TYPES}
                selected={preferences.jobTypes}
                onChange={(jobTypes) => onChange({ ...preferences, jobTypes })}
              />
              <FilterDropdown
                label="Seniority"
                options={SENIORITY_LEVELS}
                selected={preferences.seniorityLevels}
                onChange={(seniorityLevels) => onChange({ ...preferences, seniorityLevels })}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {preferences.sectors.map((s) => (
            <Badge
              key={`s-${s}`}
              variant="secondary"
              className="cursor-pointer gap-1 rounded-md bg-[#1a365d]/5 text-[11px] font-medium text-[#1a365d] hover:bg-[#1a365d]/10"
              onClick={() => onChange({ ...preferences, sectors: preferences.sectors.filter((x) => x !== s) })}
            >
              {s}
              <X className="size-3" />
            </Badge>
          ))}
          {preferences.skills.map((s) => (
            <Badge
              key={`sk-${s}`}
              variant="secondary"
              className="cursor-pointer gap-1 rounded-md bg-[#1a365d]/5 text-[11px] font-medium text-[#1a365d] hover:bg-[#1a365d]/10"
              onClick={() => onChange({ ...preferences, skills: preferences.skills.filter((x) => x !== s) })}
            >
              {s}
              <X className="size-3" />
            </Badge>
          ))}
          {preferences.workArrangements.map((s) => (
            <Badge
              key={`w-${s}`}
              variant="secondary"
              className="cursor-pointer gap-1 rounded-md bg-[#1a365d]/5 text-[11px] font-medium text-[#1a365d] hover:bg-[#1a365d]/10"
              onClick={() => onChange({ ...preferences, workArrangements: preferences.workArrangements.filter((x) => x !== s) })}
            >
              {s}
              <X className="size-3" />
            </Badge>
          ))}
          {preferences.jobTypes.map((s) => (
            <Badge
              key={`j-${s}`}
              variant="secondary"
              className="cursor-pointer gap-1 rounded-md bg-[#1a365d]/5 text-[11px] font-medium text-[#1a365d] hover:bg-[#1a365d]/10"
              onClick={() => onChange({ ...preferences, jobTypes: preferences.jobTypes.filter((x) => x !== s) })}
            >
              {s}
              <X className="size-3" />
            </Badge>
          ))}
          {preferences.seniorityLevels.map((s) => (
            <Badge
              key={`sn-${s}`}
              variant="secondary"
              className="cursor-pointer gap-1 rounded-md bg-[#1a365d]/5 text-[11px] font-medium text-[#1a365d] hover:bg-[#1a365d]/10"
              onClick={() => onChange({ ...preferences, seniorityLevels: preferences.seniorityLevels.filter((x) => x !== s) })}
            >
              {s}
              <X className="size-3" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
