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
}
