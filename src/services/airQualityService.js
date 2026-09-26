/**
 * Air Quality Service — Fetches local AQI with multi-provider resilience.
 *
 * Supports OpenWeatherMap when a valid key is configured, and seamlessly falls back
 * to Open-Meteo Air Quality (public, no key required).
 */

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'
const OPENMETEO_AQI_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'

function translateAqiLevel(index) {
  switch (index) {
    case 1:
      return { label: 'Good', color: 'moss', recommendation: 'Enjoy the fresh air — ideal conditions for walking or cycling.' }
    case 2:
      return { label: 'Fair', color: 'lichen', recommendation: 'Air quality is acceptable. Great day for low-carbon travel.' }
    case 3:
      return { label: 'Moderate', color: 'warn', recommendation: 'Air quality is moderate. Sensitive individuals should pace outdoor exercise.' }
    case 4:
      return { label: 'Poor', color: 'bad', recommendation: 'Elevated particulate levels. Consider indoor activities and transit.' }
    case 5:
      return { label: 'Very Poor', color: 'bad', recommendation: 'Air pollution is high. Keep windows closed and minimize strenuous outdoor exposure.' }
    default:
      return { label: 'Moderate', color: 'lichen', recommendation: 'Air quality is within normal seasonal ranges.' }
  }
}

function mapEuropeanAqi(aqiValue) {
  if (typeof aqiValue !== 'number') return 2
  if (aqiValue <= 20) return 1
  if (aqiValue <= 40) return 2
  if (aqiValue <= 60) return 3
  if (aqiValue <= 80) return 4
  return 5
}

async function fetchFromOpenMeteo({ lat, lon }) {
  const url = `${OPENMETEO_AQI_URL}?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,european_aqi`
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 8000)

  const response = await fetch(url, { signal: controller.signal })
  clearTimeout(timeoutId)

  if (!response.ok) {
    throw new Error(`Open-Meteo AQI failed with status ${response.status}`)
  }

  const data = await response.json()
  const current = data.current || {}
  const mappedAqi = mapEuropeanAqi(current.european_aqi)

  return {
    aqi: mappedAqi,
    aqiLevel: translateAqiLevel(mappedAqi),
    pm25: typeof current.pm2_5 === 'number' ? current.pm2_5 : null,
    pm10: typeof current.pm10 === 'number' ? current.pm10 : null,
    co: typeof current.carbon_monoxide === 'number' ? current.carbon_monoxide : null,
    no2: typeof current.nitrogen_dioxide === 'number' ? current.nitrogen_dioxide : null,
    o3: typeof current.ozone === 'number' ? current.ozone : null,
  }
}

export async function fetchAirQuality({ lat, lon, apiKey }) {
  if (!lat || !lon) return null

  // 1. Try OpenWeatherMap if key is available
  if (apiKey && apiKey.trim()) {
    try {
      const url = new URL(`${OPENWEATHER_BASE_URL}/air_pollution`)
      url.searchParams.set('lat', lat)
      url.searchParams.set('lon', lon)
      url.searchParams.set('appid', apiKey.trim())

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000)

      const response = await fetch(url, { signal: controller.signal })
      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        const measurement = data.list?.[0] || {}
        const aqi = measurement.main?.aqi ?? 2

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
    } catch (err) {
      console.warn('[AQI Service] OpenWeatherMap failed, attempting Open-Meteo fallback:', err.message)
    }
  }

  // 2. Open-Meteo fallback (Free, no key required)
  try {
    return await fetchFromOpenMeteo({ lat, lon })
  } catch (err) {
    console.error('[AQI Service] All AQI providers failed:', err.message)
    return null
  }
}
