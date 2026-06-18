const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'

export async function fetchCurrentWeather({ lat, lon, apiKey }) {
  if (!apiKey) {
    throw new Error('NO_OPENWEATHER_KEY')
  }

  const url = new URL(`${OPENWEATHER_BASE_URL}/weather`)
  url.searchParams.set('lat', lat)
  url.searchParams.set('lon', lon)
  url.searchParams.set('units', 'metric')
  url.searchParams.set('appid', apiKey)

  const response = await fetch(url)
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const message = body?.message || `Weather request failed with status ${response.status}`
    throw new Error(message)
  }

  const data = await response.json()
  return {
    temperature: data.main?.temp ?? null,
    humidity: data.main?.humidity ?? null,
    windSpeed: data.wind?.speed ?? null,
    condition: data.weather?.[0]?.main ?? 'Unknown',
    description: data.weather?.[0]?.description ?? '',
    locationName: data.name || '',
  }
}
