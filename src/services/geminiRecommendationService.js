<<<<<<< HEAD
/**
 * Environmental Recommendation Generator
 *
 * Generates context-aware sustainability tips combining daily carbon score,
 * local weather, and air quality metrics.
 */

import { formatAdviceAsText } from '../utils/geminiService.js'

export function getEnvironmentalRecommendation({ weather, airQuality, carbonScore, impactLabel }) {
  const parts = []

  if (weather && weather.condition) {
    const temp = typeof weather.temperature === 'number' ? weather.temperature : 22
    const cond = (weather.condition || '').toLowerCase()

    if (temp >= 27) {
      parts.push(`Warm conditions (${temp.toFixed(0)}°C). Setting AC thermostats to 24-25°C saves up to 15-20% on electricity emissions.`)
    } else if (temp >= 15 && temp < 27 && !cond.includes('rain') && !cond.includes('storm')) {
      parts.push(`Favorable weather (${temp.toFixed(0)}°C, ${weather.condition}) for walking, cycling, or public transit over solo driving.`)
    } else if (temp < 15) {
      parts.push(`Cool weather (${temp.toFixed(0)}°C). Dress warmly in thermal layers indoors before turning up electric heating.`)
    }
  }

  if (airQuality && airQuality.aqiLevel && airQuality.aqiLevel.recommendation) {
    parts.push(airQuality.aqiLevel.recommendation)
  }

  if (carbonScore > 8) {
    parts.push(`Your ${impactLabel || 'current'} footprint has high-impact opportunities for quick wins in transport and energy habits.`)
  } else {
    parts.push('You are living lightly on the planet today — keep building sustainable momentum!')
  }

  return parts.join(' ')
}

export async function getGeminiRecommendations({ weather, airQuality, carbonScore, impactLabel, locationInfo }) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)

    const res = await fetch('/api/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        score: carbonScore,
        impactLabel,
        weather,
        airQuality,
        locationInfo,
      }),
    })

    clearTimeout(timeoutId)

    if (res.ok) {
      const data = await res.json()
      if (data && data.success && data.advice) {
        return typeof data.advice === 'string' ? data.advice : formatAdviceAsText(data.advice)
      }
    }
  } catch (err) {
    console.info('[Env Recommendations] Using offline fallback:', err.message)
  }

  return getEnvironmentalRecommendation({ weather, airQuality, carbonScore, impactLabel })
=======
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

function buildRecommendationPrompt({ weather, airQuality, carbonScore, impactLabel }) {
  return `You are a friendly sustainability assistant in a personal carbon tracker app.
The user has today's carbon footprint score of ${carbonScore} kg CO2e, rated as "${impactLabel}".
Current local conditions are:
- Weather: ${weather.condition}, ${weather.temperature}°C, humidity ${weather.humidity}%, wind ${weather.windSpeed} m/s.
- Air quality: ${airQuality.aqiLevel.label} (AQI ${airQuality.aqi}), PM2.5 ${airQuality.pm25} µg/m3, PM10 ${airQuality.pm10} µg/m3, CO ${airQuality.co} µg/m3, NO2 ${airQuality.no2} µg/m3, O3 ${airQuality.o3} µg/m3.
Provide a short, motivating recommendation list with 2-3 practical sustainability suggestions that connect the user's carbon habits to the weather and air quality. Mention one way they can reduce impact today or tomorrow.
Use plain text, no markdown headers, and keep it under 140 words.`
}

export async function getGeminiRecommendations({ apiKey, weather, airQuality, carbonScore, impactLabel }) {
  if (!apiKey) {
    throw new Error('NO_GEMINI_KEY')
  }

  const prompt = buildRecommendationPrompt({ weather, airQuality, carbonScore, impactLabel })

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 220,
      },
    }),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const message = body?.error?.message || `Gemini request failed with status ${response.status}`
    throw new Error(message)
  }

  const data = await response.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('EMPTY_RESPONSE')
  return text.trim()
>>>>>>> 44e51c889406c7d32cea2fe385fee8568117e882
}
