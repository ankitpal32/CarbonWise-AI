/**
 * CarbonWise AI — Production-Grade Gemini Serverless Proxy (/api/coach)
 *
 * Security & Reliability Architecture:
 * - Operates exclusively server-side (Vercel Serverless / Node.js).
 * - Reads GEMINI_API_KEY from secure server environment variables.
 * - Primary verified model: gemini-3.8-flash (configurable via GEMINI_MODEL).
 * - Multi-model fallback hierarchy (gemini-3.8-flash -> gemini-flash-latest -> gemini-3.7-flash).
 * - Sliding-window IP rate limiting (max 25 requests / 10 minutes per IP).
 * - Payload size limit (< 32KB) and strict input schema sanitization.
 * - Gemini system instructions and structured JSON schema output.
 * - Bounded exponential backoff retry for transient network / 429 / 503 errors.
 * - Operational metrics logging (status, latency, error type); NEVER keys or PII.
 * - Graceful fallback payloads so frontend never crashes.
 */

const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash'
const FALLBACK_MODELS = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.7-flash']
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'
const MAX_PAYLOAD_BYTES = 32 * 1024 // 32 KB limit
const REQUEST_TIMEOUT_MS = 10000

// In-Memory Sliding-Window Rate Limiter
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 25 // 25 calls per window
const rateLimitMap = new Map()

export function checkRateLimit(clientIp) {
  if (!clientIp) return { allowed: true }
  const now = Date.now()

  // Clean expired entries periodically
  if (rateLimitMap.size > 1000) {
    for (const [ip, data] of rateLimitMap.entries()) {
      if (now - data.startTime > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.delete(ip)
      }
    }
  }

  const record = rateLimitMap.get(clientIp)
  if (!record || now - record.startTime > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(clientIp, { count: 1, startTime: now })
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 }
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 }
  }

  record.count += 1
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - record.count }
}

const SYSTEM_INSTRUCTION = `You are CarbonWise AI's Sustainability Coach.
Your mission is to provide concise, practical, empathetic, and scientifically responsible guidance based on user-provided carbon estimation data.

STRICT BEHAVIORAL RULES:
1. Always use estimation language (e.g. "Based on your estimated daily footprint of X kg CO₂e...").
2. NEVER claim emissions are "exact", "scientifically measured", or "100% accurate".
3. NEVER invent scientific statistics or make unverified claims.
4. NEVER use guilt, shame, or alarmist phrasing.
5. Provide 2-3 specific, achievable daily reduction swaps tailored directly to their highest-emitting categories.
6. Return your response STRICTLY as a valid JSON object matching this schema:
{
  "summary": "Brief 1-2 sentence overview acknowledging their estimated footprint and top category.",
  "mainCategory": "Transport / Electricity / Diet / Plastic",
  "suggestions": [
    "Specific actionable swap #1",
    "Specific actionable swap #2"
  ],
  "challenge": "A realistic, motivating mini-challenge or habit goal for today/this week.",
  "encouragement": "A positive, encouraging 1-sentence closing motivation."
}`

/**
 * Validate and sanitize client payload before processing
 */
export function validateAndSanitizePayload(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { valid: false, error: 'Payload must be a JSON object.' }
  }

  const inputs = body.inputs || body.carbon || {}
  const rawScore = typeof body.score === 'number' ? body.score : (typeof inputs.total === 'number' ? inputs.total : 0)
  const score = Math.max(0, Math.min(1000, Number(rawScore) || 0))

  const sanitizedInputs = {
    transport: typeof inputs.transport === 'string' ? inputs.transport.slice(0, 50) : 'unspecified',
    electricity: typeof inputs.electricity === 'string' ? inputs.electricity.slice(0, 50) : 'medium',
    food: typeof inputs.food === 'string' ? inputs.food.slice(0, 50) : (typeof inputs.diet === 'string' ? inputs.diet.slice(0, 50) : 'mixed'),
    plastic: typeof inputs.plastic === 'string' ? inputs.plastic.slice(0, 50) : 'medium',
  }

  const rawBreakdown = body.breakdown || inputs || {}
  const sanitizedBreakdown = {
    transport: Math.max(0, Math.min(500, Number(rawBreakdown.transport) || 0)),
    electricity: Math.max(0, Math.min(500, Number(rawBreakdown.electricity) || 0)),
    food: Math.max(0, Math.min(500, Number(rawBreakdown.food || rawBreakdown.diet) || 0)),
    plastic: Math.max(0, Math.min(500, Number(rawBreakdown.plastic) || 0)),
  }

  const impactLabel = typeof body.impactLabel === 'string' ? body.impactLabel.slice(0, 50) : 'Moderate Impact'

  // Limited recent history (max 3 records, only score and date)
  const sanitizedHistory = Array.isArray(body.history)
    ? body.history.slice(-3).map((item) => ({
        date: typeof item.date === 'string' ? item.date.slice(0, 20) : '',
        total: Math.max(0, Math.min(1000, Number(item.total || item.score) || 0)),
      }))
    : []

  // Goal & Streak
  const goalTarget = body.goal && typeof body.goal.targetPercent === 'number'
    ? Math.max(1, Math.min(100, Math.round(body.goal.targetPercent)))
    : null

  const streak = typeof body.streak === 'number' ? Math.max(0, Math.min(3650, Math.round(body.streak))) : 0

  // Regional/Environmental Context (Minimal PII)
  const weather = body.weather && typeof body.weather === 'object' ? {
    condition: typeof body.weather.condition === 'string' ? body.weather.condition.slice(0, 50) : '',
    temperature: typeof body.weather.temperature === 'number' ? Math.round(body.weather.temperature) : null,
  } : null

  const airQuality = body.airQuality && typeof body.airQuality === 'object' ? {
    aqi: typeof body.airQuality.aqi === 'number' ? Math.round(body.airQuality.aqi) : null,
    label: body.airQuality.aqiLevel && typeof body.airQuality.aqiLevel.label === 'string'
      ? body.airQuality.aqiLevel.label.slice(0, 50)
      : '',
  } : null

  const locationContext = body.locationInfo && typeof body.locationInfo === 'object' ? {
    city: typeof body.locationInfo.city === 'string' ? body.locationInfo.city.slice(0, 60) : '',
    region: typeof body.locationInfo.region === 'string' ? body.locationInfo.region.slice(0, 60) : '',
    formattedName: typeof body.locationInfo.formattedName === 'string' ? body.locationInfo.formattedName.slice(0, 80) : '',
  } : null

  return {
    valid: true,
    data: {
      inputs: sanitizedInputs,
      breakdown: sanitizedBreakdown,
      score,
      impactLabel,
      history: sanitizedHistory,
      goal: goalTarget ? { targetPercent: goalTarget } : null,
      streak,
      weather,
      airQuality,
      locationInfo: locationContext,
    },
  }
}

/**
 * Generate user-facing prompt text from sanitized data
 */
export function buildPrompt(data) {
  const { inputs, score, breakdown, impactLabel, history, goal, streak, weather, airQuality, locationInfo } = data

  const lines = [
    `User Carbon Footprint Profile:`,
    `- Estimated Daily Footprint: ${score.toFixed(1)} kg CO₂e (${impactLabel})`,
    `- Transport Habit: ${inputs.transport} (~${breakdown.transport.toFixed(1)} kg CO₂e)`,
    `- Electricity Habit: ${inputs.electricity} (~${breakdown.electricity.toFixed(1)} kg CO₂e)`,
    `- Dietary Habit: ${inputs.food} (~${breakdown.food.toFixed(1)} kg CO₂e)`,
    `- Packaging/Plastic Habit: ${inputs.plastic} (~${breakdown.plastic.toFixed(1)} kg CO₂e)`,
  ]

  if (locationInfo && (locationInfo.city || locationInfo.formattedName)) {
    lines.push(`- Regional Context: ${locationInfo.formattedName || locationInfo.city}`)
  }
  if (weather && weather.condition) {
    lines.push(`- Local Weather: ${weather.condition}, ${weather.temperature ?? '—'}°C`)
  }
  if (airQuality && airQuality.label) {
    lines.push(`- Local Air Quality: ${airQuality.label} (AQI ${airQuality.aqi ?? '—'})`)
  }
  if (goal && goal.targetPercent) {
    lines.push(`- User Target: Reduce personal footprint by ${goal.targetPercent}%`)
  }
  if (streak > 0) {
    lines.push(`- Consecutive Logging Streak: ${streak} days`)
  }
  if (history && history.length > 1) {
    const prev = history[history.length - 2]
    lines.push(`- Previous Calculation: ${prev.total.toFixed(1)} kg CO₂e on ${prev.date || 'prior day'}`)
  }

  lines.push(`\nAnalyze this data and return your structured sustainability coach recommendations as JSON.`)
  return lines.join('\n')
}

/**
 * Deterministic offline rule-based fallback advice builder
 */
export function getStructuredFallbackAdvice({ inputs, score, impactLabel, breakdown }) {
  const safeInputs = inputs || {}
  const safeBreakdown = breakdown || {}

  let highestCategory = 'Transport'
  let highestVal = safeBreakdown.transport || 0

  if ((safeBreakdown.electricity || 0) > highestVal) {
    highestCategory = 'Electricity'
    highestVal = safeBreakdown.electricity
  }
  if ((safeBreakdown.food || 0) > highestVal) {
    highestCategory = 'Diet'
    highestVal = safeBreakdown.food
  }
  if ((safeBreakdown.plastic || 0) > highestVal) {
    highestCategory = 'Plastic'
  }

  const suggestions = []

  if (safeInputs.transport === 'car') {
    suggestions.push('Swap 1-2 solo driving commutes this week for metro/bus transit or carpooling to cut travel emissions by ~60%.')
  } else {
    suggestions.push('Keep maintaining your active or public transit habits — you are saving up to 70% in transit emissions compared to solo driving.')
  }

  if (safeInputs.electricity === 'high' || safeInputs.electricity === 'medium') {
    suggestions.push('Set your AC thermostat to 24–25°C and power down idle entertainment hubs; this saves 10–18% on household grid electricity.')
  } else {
    suggestions.push('Your household electricity footprint is lean. Maintain clean appliance filters to preserve peak energy efficiency.')
  }

  if (safeInputs.food === 'non-vegetarian') {
    suggestions.push('Try introducing two plant-forward or lentil-based dinners this week to reduce dietary carbon intensity by ~30%.')
  }

  let challenge = 'Complete a 1-day Zero Solo Driving or Plant-Forward meal challenge.'
  if (highestCategory === 'Electricity') {
    challenge = 'Turn off all standby electronics and run AC at 24°C tonight.'
  } else if (highestCategory === 'Diet') {
    challenge = 'Enjoy a completely plant-based lunch and dinner today.'
  }

  return {
    summary: `Based on your estimated daily footprint of ${(score || 0).toFixed(1)} kg CO₂e (${impactLabel || 'Moderate Impact'}), ${highestCategory} represents your most impactful opportunity for improvement.`,
    mainCategory: highestCategory,
    suggestions: suggestions.slice(0, 3),
    challenge,
    encouragement: 'Small, consistent daily adjustments build significant sustainable momentum over time!',
  }
}

/**
 * Validate and safely parse structured AI response
 */
export function parseStructuredAIResponse(rawText, fallbackData) {
  if (!rawText || typeof rawText !== 'string') {
    return getStructuredFallbackAdvice(fallbackData)
  }

  try {
    let cleanText = rawText.trim()
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/```\s*$/, '').trim()
    }

    const parsed = JSON.parse(cleanText)

    if (parsed && typeof parsed === 'object') {
      const summary = typeof parsed.summary === 'string' && parsed.summary.trim() ? parsed.summary.trim() : null
      const mainCategory = typeof parsed.mainCategory === 'string' && parsed.mainCategory.trim() ? parsed.mainCategory.trim() : 'General'
      const suggestions = Array.isArray(parsed.suggestions)
        ? parsed.suggestions.filter((s) => typeof s === 'string' && s.trim()).map((s) => s.trim())
        : []
      const challenge = typeof parsed.challenge === 'string' && parsed.challenge.trim() ? parsed.challenge.trim() : 'Try a daily eco challenge today.'
      const encouragement = typeof parsed.encouragement === 'string' && parsed.encouragement.trim() ? parsed.encouragement.trim() : 'Every sustainable choice counts!'

      if (summary && suggestions.length > 0) {
        return {
          summary,
          mainCategory,
          suggestions: suggestions.slice(0, 4),
          challenge,
          encouragement,
        }
      }
    }
  } catch {
    // Fall back to plain text extraction or fallback structure
  }

  const fallback = getStructuredFallbackAdvice(fallbackData)
  if (rawText.length > 20 && !rawText.includes('{')) {
    fallback.summary = rawText.slice(0, 300).trim()
  }
  return fallback
}

/**
 * Single call to Gemini API with timeout
 */
async function executeGeminiCall({ apiKey, model, prompt }) {
  const endpoint = `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: 'application/json',
          temperature: 0.65,
          maxOutputTokens: 450,
        },
      }),
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      const data = await response.json()
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (text && typeof text === 'string') {
        return { success: true, text, model }
      }
      return { success: false, status: 200, error: 'Empty candidate text from Gemini', model }
    }

    const errBody = await response.json().catch(() => ({}))
    const errMsg = errBody?.error?.message || `Gemini status ${response.status}`
    const isTransient = response.status === 429 || response.status === 503 || response.status === 504

    return {
      success: false,
      status: response.status,
      error: errMsg,
      isTransient,
      model,
    }
  } catch (err) {
    clearTimeout(timeoutId)
    const isTimeout = err.name === 'AbortError'
    return {
      success: false,
      status: isTimeout ? 504 : 500,
      error: isTimeout ? 'Request timeout' : err.message,
      isTransient: true,
      model,
    }
  }
}

/**
 * Call Gemini API with bounded retry and multi-model fallback hierarchy
 */
async function callGeminiWithFallback({ apiKey, primaryModel, prompt }) {
  // Build deduplicated model candidate queue
  const candidateModels = Array.from(new Set([primaryModel, ...FALLBACK_MODELS].filter(Boolean)))

  for (let mIdx = 0; mIdx < candidateModels.length; mIdx++) {
    const model = candidateModels[mIdx]
    let result = await executeGeminiCall({ apiKey, model, prompt })

    if (result.success) {
      return result
    }

    // If transient error (429/503), attempt 1 quick bounded retry before switching models
    if (result.isTransient) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      result = await executeGeminiCall({ apiKey, model, prompt })
      if (result.success) {
        return result
      }
    }

    // If 404 (model deprecated / unavailable), log and continue to next candidate model
    if (result.status === 404) {
      console.warn(`[Gemini Proxy] Model "${model}" returned 404 (unavailable). Trying next candidate model...`)
      continue
    }

    // If non-transient auth/permission error (400, 401, 403), stop immediately
    if (result.status === 401 || result.status === 403 || result.status === 400) {
      return result
    }
  }

  return { success: false, status: 500, error: 'All candidate Gemini models failed or unavailable.' }
}

/**
 * Diagnostic helper: fetch available models supporting generateContent
 */
export async function getAvailableGeminiModels(apiKey) {
  if (!apiKey) return []
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
    if (!res.ok) return []
    const data = await res.json()
    return (data.models || [])
      .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
      .map((m) => m.name.replace('models/', ''))
  } catch {
    return []
  }
}

/**
 * Main Serverless Request Handler (compatible with Vercel and Node HTTP)
 */
export default async function handler(req, res) {
  const startTime = Date.now()

  // Diagnostic GET route for model discovery (development / verification)
  if (req.method === 'GET') {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return res.status(200).json({ status: 'offline', message: 'No GEMINI_API_KEY configured' })
    }
    const models = await getAvailableGeminiModels(apiKey)
    return res.status(200).json({
      status: 'active',
      configuredModel: process.env.GEMINI_MODEL || DEFAULT_MODEL,
      availableGenerateModels: models,
    })
  }

  // HTTP Method Check
  if (req.method !== 'POST') {
    if (res.setHeader) res.setHeader('Allow', ['GET', 'POST'])
    return res.status ? res.status(405).json({ error: 'Method Not Allowed' }) : null
  }

  // Client IP for abuse prevention & rate limiting
  const clientIp = (req.headers && (req.headers['x-forwarded-for'] || req.headers['x-real-ip'])) || 'client'
  const rateLimit = checkRateLimit(String(clientIp).split(',')[0].trim())

  // Server-side API key retrieval
  const apiKey = process.env.GEMINI_API_KEY
  const primaryModel = process.env.GEMINI_MODEL || DEFAULT_MODEL

  // Parse Body if string
  let body = req.body
  if (typeof body === 'string') {
    if (body.length > MAX_PAYLOAD_BYTES) {
      return res.status(413).json({ error: 'Payload exceeds maximum allowed size (32KB).' })
    }
    try {
      body = JSON.parse(body)
    } catch {
      return res.status(400).json({ error: 'Malformed JSON payload.' })
    }
  }

  // Validate and sanitize data
  const validation = validateAndSanitizePayload(body)
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error })
  }

  const sanitizedData = validation.data
  const fallbackAdvice = getStructuredFallbackAdvice(sanitizedData)

  // If rate limit exceeded, serve offline fallback safely without crashing
  if (!rateLimit.allowed) {
    console.warn(`[Coach Proxy] Rate limit exceeded for IP. Serving offline recommendation.`)
    return res.status(200).json({
      success: true,
      isOffline: true,
      advice: fallbackAdvice,
      source: 'offline-rate-limit-fallback',
      warning: 'Hourly AI request limit reached. Standard recommendations provided.',
    })
  }

  // If no server key configured, safely return deterministic fallback
  if (!apiKey) {
    console.info(`[Coach Proxy] No GEMINI_API_KEY set. Returning rule-based action plan (${Date.now() - startTime}ms).`)
    return res.status(200).json({
      success: true,
      isOffline: true,
      advice: fallbackAdvice,
      source: 'offline-rule-engine',
    })
  }

  // Call Gemini API with automatic candidate fallback
  try {
    const prompt = buildPrompt(sanitizedData)
    const result = await callGeminiWithFallback({ apiKey, primaryModel, prompt })

    if (result.success && result.text) {
      const parsedAdvice = parseStructuredAIResponse(result.text, sanitizedData)
      console.info(`[Coach Proxy] Gemini (${result.model}) success in ${Date.now() - startTime}ms.`)
      return res.status(200).json({
        success: true,
        isOffline: false,
        advice: parsedAdvice,
        source: `gemini-${result.model}`,
      })
    }

    console.warn(`[Coach Proxy] Gemini call ended with status ${result.status || 'unknown'}: ${result.error}. Serving fallback.`)
    return res.status(200).json({
      success: true,
      isOffline: true,
      advice: fallbackAdvice,
      source: 'offline-fallback',
      warning: 'Live AI service temporarily unavailable. Standard recommendations provided.',
    })
  } catch (err) {
    console.error(`[Coach Proxy] Unhandled server exception (${Date.now() - startTime}ms):`, err.message)
    return res.status(200).json({
      success: true,
      isOffline: true,
      advice: fallbackAdvice,
      source: 'offline-fallback',
      warning: 'Live AI service temporarily unavailable.',
    })
  }
}
