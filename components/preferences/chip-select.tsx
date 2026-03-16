"use client"

import { motion } from 'framer-motion'
import { interactive } from '@/lib/motion'

interface ChipSelectProps {
  label: string
  options: readonly string[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export function ChipSelect({ label, options, selected, onChange }: ChipSelectProps) {
  function toggle(option: string) {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option))
    } else {
      onChange([...selected, option])
    }
  }

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-700">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option)
          return (
            <motion.button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className={`min-h-[44px] rounded-full px-3 py-1.5 text-sm transition-colors ${
                isSelected
                  ? 'bg-[#1a365d] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              {...interactive}
            >
              {option}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
