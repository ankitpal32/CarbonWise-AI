const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'

function translateAqiLevel(index) {
  switch (index) {
    case 1:
      return { label: 'Good', color: 'moss', recommendation: 'Enjoy the fresh air — it’s a great day for outdoor activities.' }
    case 2:
      return { label: 'Fair', color: 'lichen', recommendation: 'Air quality is okay. Sensitive people may want to take it easy outside.' }
    case 3:
      return { label: 'Moderate', color: 'warn', recommendation: 'Consider reducing prolonged outdoor exertion, especially if you feel symptoms.' }
    case 4:
      return { label: 'Poor', color: 'bad', recommendation: 'Limit outdoor activity and keep windows closed if possible.' }
    case 5:
      return { label: 'Very Poor', color: 'bad', recommendation: 'Stay indoors with filtered air if possible and avoid strenuous activity.' }
    default:
      return { label: 'Unknown', color: 'bad', recommendation: 'Air quality data is unavailable right now.' }
  }
}

export async function fetchAirQuality({ lat, lon, apiKey }) {
  if (!apiKey) {
    throw new Error('NO_OPENWEATHER_KEY')
  }

  const url = new URL(`${OPENWEATHER_BASE_URL}/air_pollution`)
  url.searchParams.set('lat', lat)
  url.searchParams.set('lon', lon)
  url.searchParams.set('appid', apiKey)

  const response = await fetch(url)
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const message = body?.message || `AQI request failed with status ${response.status}`
    throw new Error(message)
  }

  const data = await response.json()
  const measurement = data.list?.[0] || {}
  const aqi = measurement.main?.aqi ?? null

  return {
    aqi,
    aqiLevel: translateAqiLevel(aqi),
    pm25: measurement.components?.pm2_5 ?? null,
    pm10: measurement.components?.pm10 ?? null,
    co: measurement.components?.co ?? null,
    no2: measurement.components?.no2 ?? null,
    o3: measurement.components?.o3 ?? null,
  }
}
