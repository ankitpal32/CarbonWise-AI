import { useState, useEffect, useCallback } from 'react'
import {
  initializeStorage,
  getHistory,
  saveTodayEntry,
  getCompletedChallenges,
  setChallengeCompletion,
  getPoints,
  getLastInput,
  saveLastInput,
  calculateStreaks,
  getGoal,
  saveGoal,
  getLocationContext,
  exportDataAsJSON,
  exportDataAsCSV,
  importDataFromJSON,
  clearAllData,
} from '../utils/storage'
import { calculateCarbonScore, getImpactLevel, getCurrentBadge, getNextBadge } from '../data/carbonData'

export function useCarbonData() {
  const [history, setHistory] = useState(() => {
    initializeStorage()
    return getHistory()
  })
  const [completed, setCompleted] = useState(() => getCompletedChallenges())
  const [points, setPoints] = useState(() => getPoints())
  const [lastInput, setLastInput] = useState(() => getLastInput())
  const [goal, setGoal] = useState(() => getGoal())
  const [locationContext, setLocationContext] = useState(() => getLocationContext())

  const refreshState = useCallback(() => {
    setHistory(getHistory())
    setCompleted(getCompletedChallenges())
    setPoints(getPoints())
    setLastInput(getLastInput())
    setGoal(getGoal())
    setLocationContext(getLocationContext())
  }, [])

  useEffect(() => {
    refreshState()
    const handleStorageChange = () => refreshState()
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [refreshState])

  const submitToday = useCallback((inputs) => {
    const { total, breakdown } = calculateCarbonScore(inputs)
    const entry = {
      date: new Date().toISOString().slice(0, 10),
      score: total,
      breakdown,
      inputs,
    }
    const updated = saveTodayEntry(entry)
    setHistory(updated)
    saveLastInput(inputs)
    setLastInput(inputs)
    return entry
  }, [])

  const toggleChallenge = useCallback((id, pointsValue) => {
    const isCompleted = Boolean(completed[id])
    const { completedMap, totalPoints } = setChallengeCompletion(id, !isCompleted, pointsValue)
    setCompleted(completedMap)
    setPoints(totalPoints)
  }, [completed])

  const setPersonalGoal = useCallback((goalData) => {
    const updated = saveGoal(goalData)
    setGoal(updated)
    return updated
  }, [])

  const resetData = useCallback(() => {
    clearAllData()
    refreshState()
  }, [refreshState])

  const exportJSON = useCallback(() => exportDataAsJSON(), [])
  const exportCSV = useCallback(() => exportDataAsCSV(), [])
  const importJSON = useCallback((jsonString) => {
    const result = importDataFromJSON(jsonString)
    if (result.success) {
      refreshState()
    }
    return result
  }, [refreshState])

  const todayStr = new Date().toISOString().slice(0, 10)
  const today = history.find((h) => h.date === todayStr) || null
  const impact = today ? getImpactLevel(today.score) : null
  const badge = getCurrentBadge(points)
  const nextBadge = getNextBadge(points)
  const { currentStreak, maxStreak } = calculateStreaks(history)

  return {
    history,
    today,
    impact,
    completed,
    points,
    badge,
    nextBadge,
    lastInput,
    goal,
    locationContext,
    currentStreak,
    maxStreak,
    submitToday,
    toggleChallenge,
    setPersonalGoal,
    resetData,
    refreshState,
    exportJSON,
    exportCSV,
    importJSON,
  }
}
