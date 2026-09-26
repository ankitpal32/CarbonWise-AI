<<<<<<< HEAD
/**
 * CarbonWise AI — AI Sustainability Coach Client Service
 *
 * Calls the secure serverless proxy endpoint (/api/coach).
 * Never uses or stores secret API keys client-side.
 * Provides deterministic structured offline fallback advice when offline or
 * when server AI is unavailable.
 */

/**
 * Generate structured offline rule-based fallback advice
 */
export function getFallbackAdvice({ inputs, score, impactLabel, breakdown }) {
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
    suggestions.push('Swap 1–2 solo driving commutes this week for bus/metro transit or cycling to cut travel emissions by up to 60%.')
  } else if (safeInputs.transport === 'bus' || safeInputs.transport === 'train') {
    suggestions.push('Keep utilizing shared transit — you are saving up to 70% in emissions compared to driving.')
  } else {
    suggestions.push('Walking and cycling keep travel emissions near zero — fantastic active transit habit!')
  }

  if (safeInputs.electricity === 'high' || safeInputs.electricity === 'medium') {
    suggestions.push('Set AC thermostat to 24–25°C and turn off standby electronics to trim 12–18% off daily power usage.')
  } else {
    suggestions.push('Your home electricity footprint is minimal. Keep maintaining clean appliance filters.')
  }

  if (safeInputs.food === 'non-vegetarian') {
    suggestions.push('Replace 1–2 meat meals with plant-rich lentils, beans, or tofu to cut food emissions by ~35%.')
  } else if (safeInputs.food === 'mixed') {
    suggestions.push('Adding one extra plant-forward day weekly compounds into significant annual CO₂e savings.')
  } else {
    suggestions.push('Plant-based eating has one of the lowest dietary carbon footprints — great job!')
  }

  if (safeInputs.plastic === 'high' || safeInputs.plastic === 'medium') {
    suggestions.push('Carry a reusable bottle and cloth tote bag — eliminating single-use packaging is a rapid eco win.')
  }

  let challenge = 'Complete a 1-day Zero Solo Driving or Plant-Forward meal challenge.'
  if (highestCategory === 'Electricity') {
    challenge = 'Turn off all standby electronics and run AC at 24°C tonight.'
  } else if (highestCategory === 'Diet') {
    challenge = 'Enjoy a completely plant-based lunch and dinner today.'
  } else if (highestCategory === 'Plastic') {
    challenge = 'Refuse all single-use plastic bags and cups today.'
  }

  return {
    summary: `Based on your estimated daily footprint of ${(score || 0).toFixed(1)} kg CO₂e (${impactLabel || 'Moderate Impact'}), ${highestCategory} represents your largest opportunity for reduction.`,
    mainCategory: highestCategory,
    suggestions: suggestions.slice(0, 3),
    challenge,
    encouragement: 'Small, consistent daily adjustments build significant sustainable momentum over time!',
  }
}

/**
 * Format structured advice into clean readable text for string consumers
 */
export function formatAdviceAsText(adviceObj) {
  if (typeof adviceObj === 'string') return adviceObj
  if (!adviceObj || typeof adviceObj !== 'object') return ''

  const lines = []
  if (adviceObj.summary) lines.push(adviceObj.summary)
  if (Array.isArray(adviceObj.suggestions) && adviceObj.suggestions.length > 0) {
    lines.push('\nActionable Steps:')
    adviceObj.suggestions.forEach((s) => lines.push(`• ${s}`))
  }
  if (adviceObj.challenge) {
    lines.push(`\nSuggested Mini-Challenge: ${adviceObj.challenge}`)
  }
  if (adviceObj.encouragement) {
    lines.push(`\n${adviceObj.encouragement}`)
  }
  return lines.join('\n')
}

/**
 * Fetch personalized advice from the secure serverless proxy (/api/coach)
 */
export async function fetchCoachAdvice({ inputs, score, breakdown, impactLabel, weather, airQuality, locationInfo, goal, streak, history }) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch('/api/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        inputs,
        score,
        breakdown,
        impactLabel,
        weather,
        airQuality,
        locationInfo,
        goal,
        streak,
        history,
      }),
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      const data = await response.json()
      if (data && data.success && data.advice) {
        return {
          advice: data.advice,
          textAdvice: formatAdviceAsText(data.advice),
          isOffline: !!data.isOffline,
          source: data.source || 'gemini',
          error: null,
        }
      }
    }
  } catch (err) {
    console.info('[CarbonWise Coach] Using offline fallback due to network/server state:', err.message)
  }

  // Graceful deterministic fallback
  const fallback = getFallbackAdvice({ inputs, score, impactLabel, breakdown })
  return {
    advice: fallback,
    textAdvice: formatAdviceAsText(fallback),
    isOffline: true,
    source: 'offline-rule-engine',
    error: null,
  }
=======
const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

function buildPrompt({ inputs, score, breakdown, impactLabel }) {
  return `You are a friendly, encouraging sustainability coach inside an app called CarbonWise AI.
A user just logged today's habits:
- Transportation: ${inputs.transport}
- Electricity usage: ${inputs.electricity}
- Food preference: ${inputs.food}
- Plastic usage: ${inputs.plastic}

Their estimated daily carbon footprint is ${score} kg CO2e, rated as "${impactLabel}".
Breakdown (kg CO2e): transport ${breakdown.transport}, electricity ${breakdown.electricity}, food ${breakdown.food}, plastic ${breakdown.plastic}.

Write a short, warm, motivating response (max 120 words) with:
1. One sentence acknowledging today's footprint without being judgmental.
2. Two or three specific, concrete, achievable actions tailored to their actual choices above (not generic advice).
3. One short encouraging closing line.

Use plain text, no markdown headers, you may use short bullet dashes for the actions. Keep it conversational, not preachy.`
}

export async function getAICoachAdvice({ apiKey, inputs, score, breakdown, impactLabel }) {
  if (!apiKey) {
    throw new Error('NO_API_KEY')
  }

  const prompt = buildPrompt({ inputs, score, breakdown, impactLabel })

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 300,
      },
    }),
  })

  if (!response.ok) {
    const errBody = await response.json().catch(() => null)
    const message = errBody?.error?.message || `Request failed with status ${response.status}`
    throw new Error(message)
  }

  const data = await response.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('EMPTY_RESPONSE')
  return text.trim()
}

export function getFallbackAdvice({ inputs, impactLabel }) {
  const lines = []
  lines.push(
    `Today's footprint is rated "${impactLabel}" — here is where focusing next will help most:`
  )
  if (inputs.transport === 'car') {
    lines.push('- Try a bus, train, or bike for at least one trip tomorrow — transport is usually the biggest lever.')
  } else {
    lines.push('- Your transport choice today is already low-impact — nice work keeping that up.')
  }
  if (inputs.electricity === 'high') {
    lines.push('- Shift AC or heavy appliance use a few hours later, and unplug devices on standby tonight.')
  } else if (inputs.electricity === 'medium') {
    lines.push('- Swap a couple of bulbs to LED and switch off devices fully instead of leaving them on standby.')
  }
  if (inputs.food === 'non-vegetarian') {
    lines.push('- Make tomorrow one plant-based meal — lentils or chickpeas are an easy, low-carbon swap.')
  } else if (inputs.food === 'mixed') {
    lines.push('- Lean a little more plant-forward this week to keep trimming your food footprint.')
  }
  if (inputs.plastic === 'high' || inputs.plastic === 'medium') {
    lines.push('- Carry a reusable bottle and bag tomorrow to cut single-use plastic fast.')
  }
  lines.push('Small, consistent swaps beat big one-off efforts — keep going, you are already paying attention.')
  return lines.join('\n')
}

export async function validateGeminiKey(apiKey) {
  if (!apiKey) throw new Error('NO_API_KEY')
  const testPrompt = 'Please respond with the single word: VALID'
  const payload = {
    contents: [{ parts: [{ text: testPrompt }] }],
    generationConfig: { temperature: 0, maxOutputTokens: 10 },
  }

  let response
  try {
    response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.error('Gemini validation network error', err)
    throw err
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    console.error('Gemini validation failed', { status: response.status, body })
    throw new Error(body?.error?.message || `Validation failed with status ${response.status}`)
  }

  const data = await response.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  return text.trim().toUpperCase().startsWith('VALID')
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
}
