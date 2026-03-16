"use client"
import { useState, useEffect, useCallback } from 'react'
import { UserPreferences } from '@/lib/types'

const STORAGE_KEY = 'daj-preferences'

const defaultPreferences: UserPreferences = {
  sectors: [],
  skills: [],
  workArrangements: [],
  jobTypes: [],
  seniorityLevels: [],
  salaryMin: null,
  salaryMax: null,
}

export function usePreferences() {
  const [preferences, setPreferencesState] = useState<UserPreferences>(defaultPreferences)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setPreferencesState({ ...defaultPreferences, ...JSON.parse(stored) })
      }
    } catch {}
    setIsLoaded(true)
  }, [])

  // Persist to localStorage on change
  const setPreferences = useCallback((prefs: UserPreferences) => {
    setPreferencesState(prefs)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    } catch {}
  }, [])

  const resetPreferences = useCallback(() => {
    setPreferencesState(defaultPreferences)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }, [])

  // Count active filters
  const activeFilterCount = [
    preferences.sectors.length > 0,
    preferences.skills.length > 0,
    preferences.workArrangements.length > 0,
    preferences.jobTypes.length > 0,
    preferences.seniorityLevels.length > 0,
    preferences.salaryMin !== null,
    preferences.salaryMax !== null,
  ].filter(Boolean).length

  return { preferences, setPreferences, resetPreferences, activeFilterCount, isLoaded }
}
