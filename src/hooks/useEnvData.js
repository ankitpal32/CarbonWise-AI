import { useEffect, useState, useRef, useCallback } from 'react'
import { fetchCurrentWeather } from '../services/weatherService'
import { fetchAirQuality } from '../services/airQualityService'
import { getEnvironmentalRecommendation } from '../services/geminiRecommendationService'
import { reverseGeocode, requestBrowserLocation } from '../services/locationService'
import { saveLocationContext, getLocationContext } from '../utils/storage'

const CACHE_KEY = 'carbonwise_env_cache'
const CACHE_DURATION_MS = 30 * 60 * 1000 // 30 mins

// Sensible fallback coordinates if geolocation is not shared (Default: Kolkata, West Bengal, India)
const DEFAULT_COORDS = {
  lat: 22.5726,
  lon: 88.3639,
  city: 'Kolkata',
  region: 'West Bengal',
  country: 'India',
  formattedName: 'Kolkata, West Bengal',
  isDefault: true,
}

function getCachedData() {
  try {
    if (typeof window === 'undefined') return null
    const raw = window.sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (Date.now() - parsed.timestamp < CACHE_DURATION_MS) {
      return parsed
    }
  } catch {
    // Ignore cache error
  }
  return null
}

function setCachedData(data) {
  try {
    if (typeof window === 'undefined') return
    window.sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ ...data, timestamp: Date.now() })
    )
  } catch {
    // Ignore cache error
  }
}

export function useEnvData({ carbonScore = 0, impactLabel = '', autoRequest = false } = {}) {
  const [weather, setWeather] = useState(null)
  const [airQuality, setAirQuality] = useState(null)
  const [locationInfo, setLocationInfo] = useState(() => getLocationContext() || null)
  const [recommendations, setRecommendations] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [locationStatus, setLocationStatus] = useState('idle') // 'idle' | 'requesting' | 'resolved' | 'denied' | 'fallback'
  const isMounted = useRef(true)

  const openWeatherKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_OPENWEATHER_API_KEY : ''

  const loadDataForCoords = useCallback(async (coords, isLiveLocation = true) => {
    try {
      if (!isMounted.current) return
      setLoading(true)
      setError('')

      const [resolvedLoc, fetchedWeather, fetchedAqi] = await Promise.all([
        coords.city && !coords.isDefault ? Promise.resolve(coords) : reverseGeocode({ lat: coords.lat, lon: coords.lon }),
        fetchCurrentWeather({ lat: coords.lat, lon: coords.lon, apiKey: openWeatherKey }),
        fetchAirQuality({ lat: coords.lat, lon: coords.lon, apiKey: openWeatherKey }),
      ])

      if (!isMounted.current) return

      const finalLoc = {
        city: resolvedLoc?.city || coords.city || 'Local Area',
        region: resolvedLoc?.region || '',
        country: resolvedLoc?.country || '',
        formattedName: coords.isDefault ? (coords.formattedName || 'Default Region') : (resolvedLoc?.formattedName || 'Local Area'),
        lat: coords.lat,
        lon: coords.lon,
        isDefault: !isLiveLocation,
      }

      setLocationInfo(finalLoc)
      if (isLiveLocation) {
        saveLocationContext(finalLoc)
      }

      setWeather(fetchedWeather)
      setAirQuality(fetchedAqi)
      setLocationStatus(isLiveLocation ? 'resolved' : 'fallback')

      const recText = getEnvironmentalRecommendation({
        weather: fetchedWeather,
        airQuality: fetchedAqi,
        carbonScore,
        impactLabel,
      })
      setRecommendations(recText)

      setCachedData({
        weather: fetchedWeather,
        airQuality: fetchedAqi,
        locationInfo: finalLoc,
        recommendations: recText,
        locationStatus: isLiveLocation ? 'resolved' : 'fallback',
      })
    } catch (err) {
      if (isMounted.current) {
        setError('Unable to load full environmental telemetry.')
      }
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }, [openWeatherKey, carbonScore, impactLabel])

  const requestLocation = useCallback(async () => {
    setLocationStatus('requesting')
    setLoading(true)
    setError('')

    const result = await requestBrowserLocation({ timeout: 8000 })
    if (!isMounted.current) return

    if (result.success && result.coords) {
      await loadDataForCoords(result.coords, true)
    } else {
      setLocationStatus(result.code === 'PERMISSION_DENIED' ? 'denied' : 'fallback')
      setError(result.error || 'Location unavailable')
      // Fallback to default coordinates gracefully without crashing
      await loadDataForCoords(DEFAULT_COORDS, false)
    }
  }, [loadDataForCoords])

  useEffect(() => {
    isMounted.current = true

    const cached = getCachedData()
    if (cached) {
      setWeather(cached.weather)
      setAirQuality(cached.airQuality)
      setLocationInfo(cached.locationInfo)
      setRecommendations(cached.recommendations || '')
      setLocationStatus(cached.locationStatus || 'resolved')
      setLoading(false)
      return () => {
        isMounted.current = false
      }
    }

    // Check if we already have saved location from prior interaction
    const savedLoc = getLocationContext()
    if (savedLoc && savedLoc.lat && savedLoc.lon) {
      loadDataForCoords(savedLoc, !savedLoc.isDefault)
      return () => {
        isMounted.current = false
      }
    }

    if (autoRequest) {
      requestLocation()
    } else {
      // Initialize with default regional data without prompting until user clicks "Use My Location"
      loadDataForCoords(DEFAULT_COORDS, false)
    }

    return () => {
      isMounted.current = false
    }
  }, [autoRequest, loadDataForCoords, requestLocation])

  const aqiAdvice = airQuality?.aqiLevel?.recommendation || ''

  return {
    weather,
    airQuality,
    locationInfo,
    recommendations,
    loading,
    error,
    locationStatus,
    hasPermission: locationStatus === 'resolved',
    requestLocation,
    aqiAdvice,
  }
}
