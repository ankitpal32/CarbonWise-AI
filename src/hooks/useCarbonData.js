import { useState, useEffect, useCallback } from 'react'
import {
  getHistory,
  saveTodayEntry,
  getCompletedChallenges,
  setChallengeCompletion,
  getPoints,
  getLastInput,
  saveLastInput,
} from '../utils/storage'
import { calculateCarbonScore, getImpactLevel, getCurrentBadge, getNextBadge } from '../data/carbonData'

export function useCarbonData() {
  const [history, setHistory] = useState(getHistory())
  const [completed, setCompleted] = useState(getCompletedChallenges())
  const [points, setPoints] = useState(getPoints())
  const [lastInput, setLastInput] = useState(getLastInput())

  useEffect(() => {
    setHistory(getHistory())
    setCompleted(getCompletedChallenges())
    setPoints(getPoints())
    setLastInput(getLastInput())
  }, [])

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
    const isCompleted = !!completed[id]
    const { completedMap, totalPoints } = setChallengeCompletion(id, !isCompleted, pointsValue)
    setCompleted({ ...completedMap })
    setPoints(totalPoints)
  }, [completed])

  const today = history.find((h) => h.date === new Date().toISOString().slice(0, 10)) || null
  const impact = today ? getImpactLevel(today.score) : null
  const badge = getCurrentBadge(points)
  const nextBadge = getNextBadge(points)

  return {
    history,
    today,
    impact,
    completed,
    points,
    badge,
    nextBadge,
    lastInput,
    submitToday,
    toggleChallenge,
  }
}
