"use client"

import { useState, useEffect, useCallback } from 'react'

// ---------------------------------------------------------------------------
// useSavedJobs
// ---------------------------------------------------------------------------

const SAVED_KEY = 'daj-saved-jobs'

export function useSavedJobs() {
  const [savedIds, setSavedIds] = useState<string[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SAVED_KEY)
      if (stored) {
        setSavedIds(JSON.parse(stored))
      }
    } catch {}
  }, [])

  const persist = useCallback((ids: string[]) => {
    setSavedIds(ids)
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(ids))
    } catch {}
  }, [])

  const save = useCallback(
    (id: string) => {
      if (!savedIds.includes(id)) {
        persist([...savedIds, id])
      }
    },
    [savedIds, persist],
  )

  const unsave = useCallback(
    (id: string) => {
      persist(savedIds.filter((sid) => sid !== id))
    },
    [savedIds, persist],
  )

  const isSaved = useCallback(
    (id: string) => savedIds.includes(id),
    [savedIds],
  )

  return { savedIds, save, unsave, isSaved }
}

// ---------------------------------------------------------------------------
// useAppliedJobs
// ---------------------------------------------------------------------------

const APPLIED_KEY = 'daj-applied-jobs'

export function useAppliedJobs() {
  const [appliedMap, setAppliedMap] = useState<Record<string, string>>({})

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(APPLIED_KEY)
      if (stored) {
        setAppliedMap(JSON.parse(stored))
      }
    } catch {}
  }, [])

  const appliedIds = Object.keys(appliedMap)

  const markApplied = useCallback(
    (id: string) => {
      const next = { ...appliedMap, [id]: new Date().toISOString() }
      setAppliedMap(next)
      try {
        localStorage.setItem(APPLIED_KEY, JSON.stringify(next))
      } catch {}
    },
    [appliedMap],
  )

  const isApplied = useCallback(
    (id: string) => id in appliedMap,
    [appliedMap],
  )

  const getAppliedDate = useCallback(
    (id: string): string | null => appliedMap[id] ?? null,
    [appliedMap],
  )

  return { appliedIds, markApplied, isApplied, getAppliedDate }
}
