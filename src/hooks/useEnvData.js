import { useEffect, useMemo, useState } from 'react'
import { fetchCurrentWeather } from '../services/weatherService'
import { fetchAirQuality } from '../services/airQualityService'
import { getGeminiRecommendations } from '../services/geminiRecommendationService'
import { getGeminiKey } from '../utils/storage'

const CACHE_KEY = 'carbonwise_live_environment_data'
const REFRESH_MS = 30 * 60 * 1000

function safeParse(value) {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

function getCachedData() {
  if (typeof localStorage === 'undefined') return null
  const raw = localStorage.getItem(CACHE_KEY)
  const data = safeParse(raw)
  if (!data || !data.timestamp) return null
  if (Date.now() - data.timestamp > REFRESH_MS) return null
  return data
}

function setCachedData(value) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(CACHE_KEY, JSON.stringify({ ...value, timestamp: Date.now() }))
}

function buildAqiRecommendation(level) {
  if (!level) return ''
  return level.recommendation
}

export function useEnvData({ carbonScore, impactLabel }) {
  const [location, setLocation] = useState({ lat: null, lon: null })
  const [weather, setWeather] = useState(null)
  const [airQuality, setAirQuality] = useState(null)
  const [recommendations, setRecommendations] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hasPermission, setHasPermission] = useState(true)

  const openWeatherKey = import.meta.env.VITE_OPENWEATHER_API_KEY
  const GEMINI_API_KEY = getGeminiKey()

  const cachedData = useMemo(getCachedData, [])

  useEffect(() => {
    if (cachedData) {
      setLocation(cachedData.location)
      setWeather(cachedData.weather)
      setAirQuality(cachedData.airQuality)
      setRecommendations(cachedData.recommendations || '')
      setLoading(false)
      return
    }

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      setLoading(false)
      setHasPermission(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        }
        setLocation(coords)

        try {
          const fetchedWeather = await fetchCurrentWeather({
            lat: coords.lat,
            lon: coords.lon,
            apiKey: openWeatherKey,
          })
          const fetchedAirQuality = await fetchAirQuality({
            lat: coords.lat,
            lon: coords.lon,
            apiKey: openWeatherKey,
          })

          setWeather(fetchedWeather)
          setAirQuality(fetchedAirQuality)

          let geminiText = ''
          if (GEMINI_API_KEY) {
            try {
              geminiText = await getGeminiRecommendations({
                apiKey: GEMINI_API_KEY,
                weather: fetchedWeather,
                airQuality: fetchedAirQuality,
                carbonScore,
                impactLabel,
              })
            } catch {
              geminiText = ''
            }
          }

          const cached = {
            location: coords,
            weather: fetchedWeather,
            airQuality: fetchedAirQuality,
            recommendations: geminiText,
          }
          setCachedData(cached)
          setRecommendations(geminiText)
        } catch (fetchError) {
          setError(fetchError.message || 'Unable to load environmental data.')
        } finally {
          setLoading(false)
        }
      },
      (positionError) => {
        setError('Location access denied or unavailable.')
        setHasPermission(false)
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    )
  }, [cachedData, carbonScore, GEMINI_API_KEY, impactLabel, openWeatherKey])

  const aqiAdvice = airQuality ? buildAqiRecommendation(airQuality.aqiLevel) : ''

  return {
    location,
    weather,
    airQuality,
    recommendations,
    loading,
    error,
    hasPermission,
    aqiAdvice,
  }
}
