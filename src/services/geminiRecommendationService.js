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
}
