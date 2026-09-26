/**
 * Weather Service — Fetches local weather with multi-provider resilience.
 *
 * Supports OpenWeatherMap when a valid key is configured, and seamlessly falls back
 * to Open-Meteo (public, no key required) so the feature works out-of-the-box.
 */

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'
const OPENMETEO_WEATHER_URL = 'https://api.open-meteo.com/v1/forecast'

function mapWmoWeatherCode(code) {
  if (code === 0) return { main: 'Clear Sky', desc: 'Clear sky' }
  if (code === 1 || code === 2) return { main: 'Partly Cloudy', desc: 'Mainly clear or partly cloudy' }
  if (code === 3) return { main: 'Overcast', desc: 'Overcast' }
  if (code >= 45 && code <= 48) return { main: 'Fog', desc: 'Fog or depositing rime fog' }
  if (code >= 51 && code <= 55) return { main: 'Drizzle', desc: 'Light to dense drizzle' }
  if (code >= 61 && code <= 65) return { main: 'Rain', desc: 'Slight to heavy rain' }
  if (code >= 71 && code <= 77) return { main: 'Snow', desc: 'Snow fall or grains' }
  if (code >= 80 && code <= 82) return { main: 'Showers', desc: 'Rain showers' }
  if (code >= 95) return { main: 'Thunderstorm', desc: 'Thunderstorm' }
  return { main: 'Partly Cloudy', desc: 'Fair' }
}

async function fetchFromOpenMeteo({ lat, lon }) {
  const url = `${OPENMETEO_WEATHER_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 8000)

  const response = await fetch(url, { signal: controller.signal })
  clearTimeout(timeoutId)

  if (!response.ok) {
    throw new Error(`Open-Meteo weather failed with status ${response.status}`)
  }

  const data = await response.json()
  const current = data.current || {}
  const weatherInfo = mapWmoWeatherCode(current.weather_code)

  return {
    temperature: typeof current.temperature_2m === 'number' ? current.temperature_2m : null,
    humidity: typeof current.relative_humidity_2m === 'number' ? current.relative_humidity_2m : null,
    windSpeed: typeof current.wind_speed_10m === 'number' ? current.wind_speed_10m : null,
    condition: weatherInfo.main,
    description: weatherInfo.desc,
    locationName: 'Local Area',
  }
}

export async function fetchCurrentWeather({ lat, lon, apiKey }) {
  if (!lat || !lon) return null

  // 1. Try OpenWeatherMap if key is available
  if (apiKey && apiKey.trim()) {
    try {
      const url = new URL(`${OPENWEATHER_BASE_URL}/weather`)
      url.searchParams.set('lat', lat)
      url.searchParams.set('lon', lon)
      url.searchParams.set('units', 'metric')
      url.searchParams.set('appid', apiKey.trim())

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000)

      const response = await fetch(url, { signal: controller.signal })
      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        return {
          temperature: typeof data.main?.temp === 'number' ? data.main.temp : null,
          humidity: typeof data.main?.humidity === 'number' ? data.main.humidity : null,
          windSpeed: typeof data.wind?.speed === 'number' ? data.wind.speed : null,
          condition: data.weather?.[0]?.main || 'Clear',
          description: data.weather?.[0]?.description || '',
          locationName: data.name || 'Local Area',
        }
      }
    } catch (err) {
      console.warn('[Weather Service] OpenWeatherMap failed, attempting Open-Meteo fallback:', err.message)
    }
  }

  // 2. Open-Meteo fallback (Free, no key required)
  try {
    return await fetchFromOpenMeteo({ lat, lon })
  } catch (err) {
    console.error('[Weather Service] All weather providers failed:', err.message)
    return null
  }
}
