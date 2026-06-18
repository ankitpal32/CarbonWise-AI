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
}
