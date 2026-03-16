'use client'

import { Badge } from '@/components/ui/badge'
import { getScoreColor } from '@/lib/scoring'
import { cn } from '@/lib/utils'

interface MatchBadgeProps {
  score: number
}

export function MatchBadge({ score }: MatchBadgeProps) {
  const colors = getScoreColor(score)

  return (
    <Badge
      className={cn(
        'rounded-full text-xs font-semibold',
        colors.bg,
        colors.text,
        colors.border,
        'border',
      )}
    >
      {score}% Match
    </Badge>
  )
}
