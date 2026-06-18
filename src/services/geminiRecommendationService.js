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
}
