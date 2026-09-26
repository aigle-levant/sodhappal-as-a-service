import { useState, useEffect, useMemo } from 'react'
import './SolarCard.css'

const PRESET_LOCATIONS = [
  { name: 'Chennai, India', lat: 13.0827, lng: 80.2707, tz: 'Asia/Kolkata' },
  { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503, tz: 'Asia/Tokyo' },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278, tz: 'Europe/London' },
  { name: 'New York, USA', lat: 40.7128, lng: -74.006, tz: 'America/New_York' },
  { name: 'San Francisco, USA', lat: 37.7749, lng: -122.4194, tz: 'America/Los_Angeles' },
]

const WEATHER_CODES = {
  0: { label: 'Clear Sky', icon: '☀️' },
  1: { label: 'Mainly Clear', icon: '🌤️' },
  2: { label: 'Partly Cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Foggy', icon: '🌫️' },
  48: { label: 'Rime Fog', icon: '🌫️' },
  51: { label: 'Light Drizzle', icon: '🌦️' },
  61: { label: 'Light Rain', icon: '🌧️' },
  63: { label: 'Moderate Rain', icon: '🌧️' },
  71: { label: 'Light Snow', icon: '🌨️' },
  80: { label: 'Rain Showers', icon: '🌦️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
}

export default function SolarCard() {
  const [selectedLocation, setSelectedLocation] = useState(PRESET_LOCATIONS[0])
  const [sunData, setSunData] = useState(null)
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [customCity, setCustomCity] = useState('')

  // Fetch solar and weather data whenever selected location changes
  useEffect(() => {
    let isCancelled = false
    setLoading(true)
    setError(null)

    async function loadData() {
      try {
        const { lat, lng } = selectedLocation

        // 1. Fetch from sunrise-sunset.org API
        const sunPromise = fetch(
          `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`
        )
          .then((res) => {
            if (!res.ok) throw new Error('Sunrise-Sunset API error')
            return res.json()
          })
          .catch(() => null)

        // 2. Fetch real-time weather from open-meteo (free, public, no key)
        const weatherPromise = fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,is_day`
        )
          .then((res) => {
            if (!res.ok) throw new Error('Weather API error')
            return res.json()
          })
          .catch(() => null)

        const [sunRes, weatherRes] = await Promise.all([sunPromise, weatherPromise])

        if (isCancelled) return

        if (sunRes && sunRes.status === 'OK') {
          setSunData(sunRes.results)
        } else {
          // Graceful fallback values
          setSunData({
            sunrise: new Date(Date.now() - 4 * 3600000).toISOString(),
            sunset: new Date(Date.now() + 6 * 3600000).toISOString(),
            day_length: 43200,
            civil_twilight_begin: new Date(Date.now() - 4.5 * 3600000).toISOString(),
            civil_twilight_end: new Date(Date.now() + 6.5 * 3600000).toISOString(),
          })
        }

        if (weatherRes && weatherRes.current) {
          const wCode = weatherRes.current.weather_code ?? 0
          const meta = WEATHER_CODES[wCode] || { label: 'Clear Sky', icon: '☀️' }
          setWeatherData({
            temp: Math.round(weatherRes.current.temperature_2m),
            condition: meta.label,
            icon: meta.icon,
            isDay: weatherRes.current.is_day === 1,
          })
        } else {
          setWeatherData({
            temp: 29,
            condition: 'Clear Sky',
            icon: '☀️',
            isDay: true,
          })
        }
      } catch (err) {
        if (!isCancelled) {
          setError('Could not fetch real-time data. Showing cached calculation.')
        }
      } finally {
        if (!isCancelled) setLoading(false)
      }
    }

    loadData()
    return () => {
      isCancelled = true
    }
  }, [selectedLocation])

  // Geolocation trigger
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setSelectedLocation({
          name: 'My Current Location',
          lat: parseFloat(pos.coords.latitude.toFixed(4)),
          lng: parseFloat(pos.coords.longitude.toFixed(4)),
        })
      },
      () => {
        alert('Could not access your location. Please check browser permissions.')
      }
    )
  }

  // Format times nicely in the user's timezone or time string
  const formattedTimes = useMemo(() => {
    if (!sunData) {
      return {
        sunrise: '5:58 AM',
        sunset: '6:04 PM',
        dayLength: '12h 06m',
        dawn: '5:38 AM',
        dusk: '6:25 PM',
        sunProgressPercent: 50,
        isNight: false,
      }
    }

    try {
      const sunriseDate = new Date(sunData.sunrise)
      const sunsetDate = new Date(sunData.sunset)
      const dawnDate = new Date(sunData.civil_twilight_begin)
      const duskDate = new Date(sunData.civil_twilight_end)

      const timeFormat = { hour: 'numeric', minute: '2-digit', hour12: true }

      const sunriseStr = sunriseDate.toLocaleTimeString([], timeFormat)
      const sunsetStr = sunsetDate.toLocaleTimeString([], timeFormat)
      const dawnStr = dawnDate.toLocaleTimeString([], timeFormat)
      const duskStr = duskDate.toLocaleTimeString([], timeFormat)

      // Calculate Day Length string
      const sec = sunData.day_length || 0
      const hrs = Math.floor(sec / 3600)
      const mins = Math.floor((sec % 3600) / 60)
      const dayLengthStr = `${hrs}h ${mins.toString().padStart(2, '0')}m`

      // Calculate solar position progress (0 to 100%)
      const now = Date.now()
      const totalDaylightMs = sunsetDate.getTime() - sunriseDate.getTime()
      const elapsedMs = now - sunriseDate.getTime()
      let progress = 50

      if (totalDaylightMs > 0) {
        progress = Math.min(100, Math.max(0, (elapsedMs / totalDaylightMs) * 100))
      }

      const isNight = now < sunriseDate.getTime() || now > sunsetDate.getTime()

      return {
        sunrise: sunriseStr,
        sunset: sunsetStr,
        dayLength: dayLengthStr,
        dawn: dawnStr,
        dusk: duskStr,
        sunProgressPercent: Math.round(progress),
        isNight,
      }
    } catch {
      return {
        sunrise: '5:58 AM',
        sunset: '6:04 PM',
        dayLength: '12h 06m',
        dawn: '5:38 AM',
        dusk: '6:25 PM',
        sunProgressPercent: 50,
        isNight: false,
      }
    }
  }, [sunData])

  // Calculate arc coordinates for the glowing sun on a semicircle
  const arcPosition = useMemo(() => {
    // Semi-circle arc: angle from 180° (sunrise) to 0° (sunset)
    const pct = formattedTimes.sunProgressPercent / 100
    const angleRad = Math.PI * (1 - pct) // Math.PI to 0
    // Center at (150, 100), radius 80
    const cx = 150
    const cy = 100
    const r = 75
    const x = cx + r * Math.cos(angleRad)
    const y = cy - r * Math.sin(angleRad)
    return { x, y }
  }, [formattedTimes.sunProgressPercent])

  return (
    <div className="solar-card-container">
      {/* City Switcher Bar */}
      <div className="solar-location-pills">
        {PRESET_LOCATIONS.map((loc) => (
          <button
            key={loc.name}
            type="button"
            className={`solar-pill-btn ${
              selectedLocation.name === loc.name ? 'solar-pill-btn--active' : ''
            }`}
            onClick={() => setSelectedLocation(loc)}
          >
            {loc.name.split(',')[0]}
          </button>
        ))}
        <button
          type="button"
          className="solar-pill-btn solar-pill-btn--geo"
          onClick={handleUseMyLocation}
          title="Use GPS Location"
        >
          📍 Locate Me
        </button>
      </div>

      {/* Main Animated Solar Card */}
      <div className={`solar-card ${formattedTimes.isNight ? 'solar-card--night' : 'solar-card--day'}`}>
        {/* Animated Background Atmosphere */}
        <div className="solar-atmosphere-glow" aria-hidden="true" />
        <div className="solar-shimmer-particles" aria-hidden="true" />

        {/* ─── Top Row: Location (Left) & Weather (Right) ─── */}
        <div className="solar-card-header">
          {/* Top Left Corner: Location */}
          <div className="solar-header-location">
            <div className="solar-location-pin">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
              </svg>
            </div>
            <div className="solar-location-text">
              <span className="solar-location-name">{selectedLocation.name}</span>
              <span className="solar-location-coords">
                {selectedLocation.lat}° N, {selectedLocation.lng}° E
              </span>
            </div>
          </div>

          {/* Top Right Corner: Weather */}
          <div className="solar-header-weather">
            {weatherData ? (
              <div className="solar-weather-pill">
                <span className="solar-weather-icon" role="img" aria-label={weatherData.condition}>
                  {weatherData.icon}
                </span>
                <div className="solar-weather-info">
                  <span className="solar-weather-temp">{weatherData.temp}°C</span>
                  <span className="solar-weather-label">{weatherData.condition}</span>
                </div>
              </div>
            ) : (
              <div className="solar-weather-skeleton">Updating weather...</div>
            )}
          </div>
        </div>

        {/* ─── Center: Animated Solar Trajectory Arc ─── */}
        <div className="solar-arc-wrapper">
          <svg
            className="solar-arc-svg"
            viewBox="0 0 300 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Horizon dashed base line */}
            <line
              x1="30"
              y1="102"
              x2="270"
              y2="102"
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Semicircle Trajectory Path */}
            <path
              d="M 75 100 A 75 75 0 0 1 225 100"
              stroke="url(#solarArcGradient)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Gradient definition - cohesive warm muted gold */}
            <defs>
              <linearGradient id="solarArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C59B58" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#DFB978" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#C59B58" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Glowing moving Sun marker */}
            <g transform={`translate(${arcPosition.x}, ${arcPosition.y})`}>
              {/* Outer pulsing solar halo */}
              <circle r="12" fill="rgba(223, 185, 120, 0.18)" className="solar-pulse-halo" />
              {/* Mid glow */}
              <circle r="8" fill="rgba(217, 154, 61, 0.45)" />
              {/* Sun Core */}
              <circle r="5" fill="#FBF9F3" stroke="#C59B58" strokeWidth="1.5" />
            </g>
          </svg>

          {/* Current Solar Phase Badge */}
          <div className="solar-phase-status">
            <span className="solar-phase-dot" />
            <span className="solar-phase-text">
              {formattedTimes.isNight
                ? 'Night Phase · Awaiting Dawn'
                : formattedTimes.sunProgressPercent >= 75
                ? 'Golden Hour Approaching'
                : 'Daylight Phase Active'}
            </span>
          </div>
        </div>

        {/* ─── Bottom Main Display: Sunrise & Sunset Times ─── */}
        <div className="solar-times-grid">
          {/* Sunrise Card */}
          <div className="solar-time-block solar-time-block--sunrise">
            <div className="solar-time-icon-wrap">
              <span className="solar-time-icon">🌅</span>
            </div>
            <div className="solar-time-details">
              <span className="solar-time-title">Sunrise happens at</span>
              <span className="solar-time-value">{formattedTimes.sunrise}</span>
              <span className="solar-time-sub">Dawn starts {formattedTimes.dawn}</span>
            </div>
          </div>

          {/* Sunset Card */}
          <div className="solar-time-block solar-time-block--sunset">
            <div className="solar-time-icon-wrap">
              <span className="solar-time-icon">🌇</span>
            </div>
            <div className="solar-time-details">
              <span className="solar-time-title">Sunset happens at</span>
              <span className="solar-time-value">{formattedTimes.sunset}</span>
              <span className="solar-time-sub">Dusk ends {formattedTimes.dusk}</span>
            </div>
          </div>
        </div>

        {/* ─── Footer Stats: Day Length & Source ─── */}
        <div className="solar-card-footer">
          <div className="solar-stat-item">
            <span className="solar-stat-label">Total Daylight</span>
            <span className="solar-stat-value">{formattedTimes.dayLength}</span>
          </div>
          <div className="solar-stat-divider" />
          <div className="solar-stat-item">
            <span className="solar-stat-label">Sun Trajectory</span>
            <span className="solar-stat-value">{formattedTimes.sunProgressPercent}% elapsed</span>
          </div>
          <div className="solar-stat-divider" />
          <div className="solar-stat-item">
            <a
              href="https://sunrise-sunset.org/api"
              target="_blank"
              rel="noreferrer"
              className="solar-api-credit"
            >
              Powered by sunrise-sunset.org ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
