const KEYS = {
  HISTORY: 'carbonwise_history',
  CHALLENGES: 'carbonwise_challenges',
  POINTS: 'carbonwise_points',
  LAST_INPUT: 'carbonwise_last_input',
  GEMINI_KEY: 'carbonwise_gemini_key',
}

function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

// ---- Daily history (carbon score entries) ----
export function getHistory() {
  return safeGet(KEYS.HISTORY, [])
}

export function saveTodayEntry(entry) {
  const history = getHistory()
  const today = entry.date
  const idx = history.findIndex((h) => h.date === today)
  if (idx >= 0) {
    history[idx] = entry
  } else {
    history.push(entry)
  }
  history.sort((a, b) => new Date(a.date) - new Date(b.date))
  safeSet(KEYS.HISTORY, history)
  return history
}

export function getTodayEntry() {
  const today = new Date().toISOString().slice(0, 10)
  return getHistory().find((h) => h.date === today) || null
}

// ---- Challenges & points ----
export function getCompletedChallenges() {
  return safeGet(KEYS.CHALLENGES, {})
}

export function setChallengeCompletion(id, completed, points) {
  const completedMap = getCompletedChallenges()
  const wasCompleted = !!completedMap[id]
  completedMap[id] = completed ? { date: new Date().toISOString().slice(0, 10) } : undefined
  if (!completed) delete completedMap[id]
  safeSet(KEYS.CHALLENGES, completedMap)

  let totalPoints = getPoints()
  if (completed && !wasCompleted) totalPoints += points
  if (!completed && wasCompleted) totalPoints = Math.max(0, totalPoints - points)
  safeSet(KEYS.POINTS, totalPoints)
  return { completedMap, totalPoints }
}

export function getPoints() {
  return safeGet(KEYS.POINTS, 0)
}

// ---- Last calculator input (used to prefill + for AI coach context) ----
export function getLastInput() {
  return safeGet(KEYS.LAST_INPUT, null)
}

export function saveLastInput(input) {
  safeSet(KEYS.LAST_INPUT, input)
}

// ---- Gemini API key (kept local only) ----
export function getGeminiKey() {
  return safeGet(KEYS.GEMINI_KEY, '')
}

export function saveGeminiKey(key) {
  safeSet(KEYS.GEMINI_KEY, key)
}

export function removeGeminiKey() {
  try {
    localStorage.removeItem(KEYS.GEMINI_KEY)
    return true
  } catch {
    return false
  }
}

export function clearAllData() {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k))
}

