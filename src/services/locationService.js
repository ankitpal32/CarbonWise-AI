/**
 * Location Service — Browser Geolocation & Reverse Geocoding
 *
 * Resolves user coordinates into city/region information cleanly without
 * requiring user authentication or sending personal data to private databases.
 */

const REVERSE_GEOCODE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client'

export async function reverseGeocode({ lat, lon }) {
  if (!lat || !lon) return { city: 'Local Area', region: '', country: '' }

  try {
    const url = `${REVERSE_GEOCODE_URL}?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6000)

    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)

    if (res.ok) {
      const data = await res.json()
      const city = data.city || data.locality || data.principalSubdivision || 'Local Area'
      const region = data.principalSubdivision || ''
      const country = data.countryName || ''

      const formattedName = [city, region, country].filter(Boolean).slice(0, 2).join(', ')

      return {
        city,
        region,
        country,
        formattedName: formattedName || 'Local Area',
        lat,
        lon,
      }
    }
  } catch (err) {
    console.warn('[LocationService] Reverse geocode error:', err.message)
  }

  return {
    city: 'Local Area',
    region: '',
    country: '',
    formattedName: 'Local Area',
    lat,
    lon,
  }
}

/**
 * Request browser geolocation with timeout and explicit error handling
 */
export function requestBrowserLocation(options = { timeout: 10000, enableHighAccuracy: false }) {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return resolve({
        success: false,
        error: 'Geolocation is not supported by your browser.',
        code: 'UNSUPPORTED',
      })
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          success: true,
          coords: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
        })
      },
      (error) => {
        let errorMsg = 'Unable to retrieve your location.'
        let code = 'UNKNOWN'

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Location permission was denied. You can continue with standard estimates.'
            code = 'PERMISSION_DENIED'
            break
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Location information is currently unavailable.'
            code = 'POSITION_UNAVAILABLE'
            break
          case error.TIMEOUT:
            errorMsg = 'Location request timed out.'
            code = 'TIMEOUT'
            break
        }

        resolve({
          success: false,
          error: errorMsg,
          code,
        })
      },
      {
        timeout: options.timeout || 10000,
        maximumAge: 300000, // 5 min cache
        enableHighAccuracy: options.enableHighAccuracy || false,
      }
    )
  })
}
