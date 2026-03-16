"use client"

import { Slider } from '@/components/ui/slider'

interface SalaryRangeSliderProps {
  min: number
  max: number
  value: [number | null, number | null]
  onChange: (value: [number | null, number | null]) => void
}

function formatSalary(val: number) {
  return `$${Math.round(val / 1000)}k`
}

export function SalaryRangeSlider({ min, max, value, onChange }: SalaryRangeSliderProps) {
  const sliderMin = value[0] ?? min
  const sliderMax = value[1] ?? max
  const isAny = value[0] === null && value[1] === null

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-700">Salary Range</p>
      <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
        <span>{isAny ? 'Any' : formatSalary(sliderMin)}</span>
        {!isAny && <span>{formatSalary(sliderMax)}</span>}
      </div>
      <Slider
        min={min}
        max={max}
        step={10000}
        value={[sliderMin, sliderMax]}
        onValueChange={(newValue) => {
          const arr = newValue as number[]
          const newMin = arr[0] === min ? null : arr[0]
          const newMax = arr[1] === max ? null : arr[1]
          onChange([newMin, newMax])
        }}
        className="[&_[data-slot=slider-range]]:bg-[#1a365d] [&_[data-slot=slider-thumb]]:border-[#1a365d]"
      />
    </div>
  )
}
