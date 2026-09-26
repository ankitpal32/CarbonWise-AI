/**
 * CarbonWise AI — Local Storage Persistence Layer
 *
 * Provides safe JSON serialization, schema versioning, data validation/sanitization,
 * streak tracking, personal goals, data export/import, and corruption-proof recovery.
 *
 * NOTE: API keys, authentication credentials, and passwords are NEVER stored.
 */

import { FACTOR_VERSION } from '../data/emissionFactors.js'

const STORAGE_VERSION = 1

const KEYS = {
  VERSION: 'carbonwise_schema_version',
  HISTORY: 'carbonwise_history',
  CHALLENGES: 'carbonwise_challenges',
  POINTS: 'carbonwise_points',
  LAST_INPUT: 'carbonwise_last_input',
  STREAK: 'carbonwise_streak',
  GOAL: 'carbonwise_goal',
  LOCATION_CONTEXT: 'carbonwise_location_context',
  PREFERENCES: 'carbonwise_preferences',
  LEGACY_GEMINI_KEY: 'carbonwise_gemini_key',
}

function isStorageAvailable() {
  try {
    const testKey = '__carbonwise_storage_test__'
    window.localStorage.setItem(testKey, testKey)
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

export function safeGet(key, fallback) {
  if (!isStorageAvailable()) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null || raw === undefined) return fallback
    const parsed = JSON.parse(raw)
    return parsed !== null && parsed !== undefined ? parsed : fallback
  } catch (err) {
    console.warn(`[CarbonWise Storage] Failed parsing key "${key}", falling back:`, err)
    return fallback
  }
}

export function safeSet(key, value) {
  if (!isStorageAvailable()) return false
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (err) {
    console.error(`[CarbonWise Storage] Failed saving key "${key}":`, err)
    return false
  }
}

export function initializeStorage() {
  if (!isStorageAvailable()) return

  // Scrub any legacy unsafe keys
  try {
    if (window.localStorage.getItem(KEYS.LEGACY_GEMINI_KEY)) {
      window.localStorage.removeItem(KEYS.LEGACY_GEMINI_KEY)
    }
  } catch {
    // Ignore
  }

  const currentVersion = safeGet(KEYS.VERSION, 0)
  if (currentVersion < STORAGE_VERSION) {
    safeSet(KEYS.VERSION, STORAGE_VERSION)
  }
}

// ---- Daily History Sanitization & Storage ----

function sanitizeHistoryEntry(entry) {
  if (!entry || typeof entry !== 'object') return null
  const date = typeof entry.date === 'string' && entry.date.length >= 10 ? entry.date.slice(0, 10) : null
  if (!date) return null

  const score = typeof entry.score === 'number' && Number.isFinite(entry.score) ? Math.max(0, +entry.score.toFixed(2)) : 0
  const breakdown = entry.breakdown && typeof entry.breakdown === 'object' ? {
    transport: Number.isFinite(entry.breakdown.transport) ? +entry.breakdown.transport.toFixed(2) : 0,
    electricity: Number.isFinite(entry.breakdown.electricity) ? +entry.breakdown.electricity.toFixed(2) : 0,
    food: Number.isFinite(entry.breakdown.food) ? +entry.breakdown.food.toFixed(2) : 0,
    plastic: Number.isFinite(entry.breakdown.plastic) ? +entry.breakdown.plastic.toFixed(2) : 0,
  } : { transport: 0, electricity: 0, food: 0, plastic: 0 }

  const inputs = entry.inputs && typeof entry.inputs === 'object' ? {
    transport: entry.inputs.transport || 'car',
    electricity: entry.inputs.electricity || 'medium',
    food: entry.inputs.food || 'mixed',
    plastic: entry.inputs.plastic || 'medium',
  } : { transport: 'car', electricity: 'medium', food: 'mixed', plastic: 'medium' }

  const factorVersion = typeof entry.factorVersion === 'string' ? entry.factorVersion : FACTOR_VERSION

  return { date, score, breakdown, inputs, factorVersion }
}

export function getHistory() {
  const rawList = safeGet(KEYS.HISTORY, [])
  if (!Array.isArray(rawList)) return []
  return rawList
    .map(sanitizeHistoryEntry)
    .filter(Boolean)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
}

export function saveTodayEntry(entry) {
  const sanitized = sanitizeHistoryEntry(entry)
  if (!sanitized) return getHistory()

  const history = getHistory()
  const idx = history.findIndex((h) => h.date === sanitized.date)
  if (idx >= 0) {
    history[idx] = sanitized
  } else {
    history.push(sanitized)
  }
  history.sort((a, b) => new Date(a.date) - new Date(b.date))
  safeSet(KEYS.HISTORY, history)
  return history
}

export function getTodayEntry() {
  const today = new Date().toISOString().slice(0, 10)
  return getHistory().find((h) => h.date === today) || null
}

// ---- Streak Calculation ----

export function calculateStreaks(historyList) {
  const history = Array.isArray(historyList) ? historyList : getHistory()
  if (history.length === 0) return { currentStreak: 0, maxStreak: 0 }

  const dateSet = new Set(history.map((h) => h.date))
  const today = new Date()
  const todayStr = today.toISOString().slice(0, 10)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().slice(0, 10)

  let currentStreak = 0
  let checkDate = dateSet.has(todayStr) ? new Date(today) : (dateSet.has(yesterdayStr) ? new Date(yesterday) : null)

  if (checkDate) {
    while (true) {
      const dStr = checkDate.toISOString().slice(0, 10)
      if (dateSet.has(dStr)) {
        currentStreak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }
  }

  let maxStreak = 0
  let tempStreak = 0
  let prevDate = null

  const sortedDates = Array.from(dateSet).sort()
  for (const dateStr of sortedDates) {
    const curDate = new Date(dateStr)
    if (prevDate) {
      const diffDays = Math.round((curDate - prevDate) / (1000 * 60 * 60 * 24))
      if (diffDays === 1) {
        tempStreak++
      } else {
        tempStreak = 1
      }
    } else {
      tempStreak = 1
    }
    if (tempStreak > maxStreak) maxStreak = tempStreak
    prevDate = curDate
  }

  return { currentStreak, maxStreak }
}

// ---- Challenges & Points ----

export function getCompletedChallenges() {
  const raw = safeGet(KEYS.CHALLENGES, {})
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  return raw
}

export function setChallengeCompletion(id, completed, points) {
  const completedMap = { ...getCompletedChallenges() }
  const wasCompleted = Boolean(completedMap[id])
  const safePointsVal = typeof points === 'number' && Number.isFinite(points) ? Math.max(0, points) : 0

  if (completed) {
    completedMap[id] = {
      date: new Date().toISOString().slice(0, 10),
      timestamp: Date.now(),
    }
  } else {
    delete completedMap[id]
  }
  safeSet(KEYS.CHALLENGES, completedMap)

  let totalPoints = getPoints()
  if (completed && !wasCompleted) {
    totalPoints += safePointsVal
  } else if (!completed && wasCompleted) {
    totalPoints = Math.max(0, totalPoints - safePointsVal)
  }

  safeSet(KEYS.POINTS, totalPoints)
  return { completedMap, totalPoints }
}

export function getPoints() {
  const raw = safeGet(KEYS.POINTS, 0)
  return typeof raw === 'number' && Number.isFinite(raw) ? Math.max(0, Math.floor(raw)) : 0
}

// ---- Last Input ----

export function getLastInput() {
  const raw = safeGet(KEYS.LAST_INPUT, null)
  if (!raw || typeof raw !== 'object') return null
  return {
    transport: raw.transport || 'car',
    electricity: raw.electricity || 'medium',
    food: raw.food || 'mixed',
    plastic: raw.plastic || 'medium',
  }
}

export function saveLastInput(input) {
  if (!input || typeof input !== 'object') return
  safeSet(KEYS.LAST_INPUT, {
    transport: input.transport || 'car',
    electricity: input.electricity || 'medium',
    food: input.food || 'mixed',
    plastic: input.plastic || 'medium',
  })
}

// ---- Personal Goals ----

export function getGoal() {
  const raw = safeGet(KEYS.GOAL, null)
  if (!raw || typeof raw !== 'object') return null
  return {
    targetKg: typeof raw.targetKg === 'number' && Number.isFinite(raw.targetKg) ? raw.targetKg : null,
    targetPercent: typeof raw.targetPercent === 'number' ? raw.targetPercent : 15,
    baseScore: typeof raw.baseScore === 'number' ? raw.baseScore : null,
    enabled: Boolean(raw.enabled),
    createdAt: raw.createdAt || new Date().toISOString(),
  }
}

export function saveGoal(goal) {
  if (!goal || typeof goal !== 'object') {
    if (isStorageAvailable()) window.localStorage.removeItem(KEYS.GOAL)
    return null
  }
  const cleanGoal = {
    targetKg: typeof goal.targetKg === 'number' && Number.isFinite(goal.targetKg) ? +goal.targetKg.toFixed(1) : null,
    targetPercent: typeof goal.targetPercent === 'number' ? Math.max(5, Math.min(60, goal.targetPercent)) : 15,
    baseScore: typeof goal.baseScore === 'number' ? +goal.baseScore.toFixed(1) : null,
    enabled: Boolean(goal.enabled),
    createdAt: goal.createdAt || new Date().toISOString(),
  }
  safeSet(KEYS.GOAL, cleanGoal)
  return cleanGoal
}

// ---- Location Context ----

export function getLocationContext() {
  const raw = safeGet(KEYS.LOCATION_CONTEXT, null)
  if (!raw || typeof raw !== 'object') return null
  return {
    city: typeof raw.city === 'string' && raw.city ? raw.city : 'Kolkata',
    region: typeof raw.region === 'string' ? raw.region : 'West Bengal',
    country: typeof raw.country === 'string' ? raw.country : 'India',
    formattedName: typeof raw.formattedName === 'string' && raw.formattedName ? raw.formattedName : 'Kolkata, West Bengal',
    lat: typeof raw.lat === 'number' && Number.isFinite(raw.lat) ? raw.lat : 22.5726,
    lon: typeof raw.lon === 'number' && Number.isFinite(raw.lon) ? raw.lon : 88.3639,
    isDefault: raw.isDefault !== undefined ? Boolean(raw.isDefault) : true,
    timestamp: typeof raw.timestamp === 'number' ? raw.timestamp : Date.now(),
  }
}

export function saveLocationContext(loc) {
  if (!loc || typeof loc !== 'object') return
  safeSet(KEYS.LOCATION_CONTEXT, {
    city: typeof loc.city === 'string' && loc.city ? loc.city : 'Kolkata',
    region: typeof loc.region === 'string' ? loc.region : 'West Bengal',
    country: typeof loc.country === 'string' ? loc.country : 'India',
    formattedName: typeof loc.formattedName === 'string' && loc.formattedName ? loc.formattedName : (loc.isDefault ? 'Kolkata, West Bengal' : 'Detected Location'),
    lat: typeof loc.lat === 'number' && Number.isFinite(loc.lat) ? loc.lat : 22.5726,
    lon: typeof loc.lon === 'number' && Number.isFinite(loc.lon) ? loc.lon : 88.3639,
    isDefault: Boolean(loc.isDefault),
    timestamp: Date.now(),
  })
}

// ---- Preferences ----

export function getPreferences() {
  return safeGet(KEYS.PREFERENCES, { regionalGrid: 'india' })
}

export function savePreferences(prefs) {
  safeSet(KEYS.PREFERENCES, prefs)
}

// ---- Data Export & Import ----

export function exportDataAsJSON() {
  const data = {
    version: STORAGE_VERSION,
    factorVersion: FACTOR_VERSION,
    exportedAt: new Date().toISOString(),
    history: getHistory(),
    challenges: getCompletedChallenges(),
    points: getPoints(),
    lastInput: getLastInput(),
    goal: getGoal(),
    preferences: getPreferences(),
  }
  return JSON.stringify(data, null, 2)
}

export function exportDataAsCSV() {
  const history = getHistory()
  if (history.length === 0) {
    return 'Date,TotalScore_kgCO2e,Transport_kg,Electricity_kg,Food_kg,Plastic_kg,FactorVersion\n'
  }

  const header = 'Date,TotalScore_kgCO2e,Transport_kg,Electricity_kg,Food_kg,Plastic_kg,FactorVersion\n'
  const rows = history.map((h) => {
    const b = h.breakdown || {}
    return `${h.date},${h.score},${b.transport || 0},${b.electricity || 0},${b.food || 0},${b.plastic || 0},${h.factorVersion || FACTOR_VERSION}`
  })

  return header + rows.join('\n')
}

export function importDataFromJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString)
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Invalid JSON format' }
    }

    if (Array.isArray(parsed.history)) {
      const sanitizedHistory = parsed.history.map(sanitizeHistoryEntry).filter(Boolean)
      safeSet(KEYS.HISTORY, sanitizedHistory)
    }

    if (parsed.challenges && typeof parsed.challenges === 'object' && !Array.isArray(parsed.challenges)) {
      safeSet(KEYS.CHALLENGES, parsed.challenges)
    }

    if (typeof parsed.points === 'number') {
      safeSet(KEYS.POINTS, Math.max(0, Math.floor(parsed.points)))
    }

    if (parsed.lastInput && typeof parsed.lastInput === 'object') {
      saveLastInput(parsed.lastInput)
    }

    if (parsed.goal && typeof parsed.goal === 'object') {
      saveGoal(parsed.goal)
    }

    if (parsed.preferences && typeof parsed.preferences === 'object') {
      savePreferences(parsed.preferences)
    }

    safeSet(KEYS.VERSION, STORAGE_VERSION)
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message || 'Failed parsing JSON file' }
  }
}

// ---- Reset All Data ----

export function clearAllData() {
  if (!isStorageAvailable()) return false
  try {
    Object.values(KEYS).forEach((k) => window.localStorage.removeItem(k))
    safeSet(KEYS.VERSION, STORAGE_VERSION)
    return true
  } catch (err) {
    console.error('[CarbonWise Storage] Failed resetting storage:', err)
    return false
  }
}
