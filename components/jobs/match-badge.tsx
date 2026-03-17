'use client'

import { getScoreColor } from '@/lib/scoring'
import { cn } from '@/lib/utils'

interface MatchBadgeProps {
  score: number
}

export function MatchBadge({ score }: MatchBadgeProps) {
  const colors = getScoreColor(score)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs tabular-nums',
        colors.bg,
      )}
    >
      <span className={cn('font-medium', colors.accent)}>{score}%</span>
      <span className={cn('font-normal', colors.text, 'opacity-70')}>Match</span>
    </span>
  )
}
