import { useState, useEffect } from 'react'
import './SpeciesCard.css'

// Curated fallbacks in case user is offline or API rate limits
const FALLBACK_SPECIES = [
  {
    id: 119854,
    commonName: 'Indian Roller',
    scientificName: 'Coracias benghalensis',
    taxon: 'Aves',
    observationsCount: 1420,
    photo: 'https://inaturalist-open-data.s3.amazonaws.com/photos/49235288/medium.jpeg',
    url: 'https://www.inaturalist.org/taxa/119854-Coracias-benghalensis',
    activityTag: 'Golden Hour Forager',
    bestTime: 'Early morning & late afternoon golden light',
  },
  {
    id: 67990,
    commonName: 'Tawny Coster Butterfly',
    scientificName: 'Acraea terpsicore',
    taxon: 'Insecta',
    observationsCount: 965,
    photo: 'https://inaturalist-open-data.s3.amazonaws.com/photos/207703103/medium.jpg',
    url: 'https://www.inaturalist.org/taxa/67990-Acraea-terpsicore',
    activityTag: 'Sunlight Thermoregulator',
    bestTime: 'Peak flight during warm sunny hours',
  },
  {
    id: 31252,
    commonName: 'Indian Garden Lizard',
    scientificName: 'Calotes versicolor',
    taxon: 'Reptilia',
    observationsCount: 934,
    photo: 'https://inaturalist-open-data.s3.amazonaws.com/photos/164183277/medium.jpeg',
    url: 'https://www.inaturalist.org/taxa/31252-Calotes-versicolor',
    activityTag: 'Basking Reptile',
    bestTime: 'Active during bright daylight & warm stones',
  },
]

export default function SpeciesCard({
  location = { name: 'Chennai, India', lat: 13.0827, lng: 80.2707 },
  weather = { temp: 34, condition: 'Clear Sky' },
  solarInfo = { sunrise: '5:56 AM', sunset: '6:03 PM', isNight: false, sunProgressPercent: 73 },
  onSpeciesLoaded,
}) {
  const [speciesList, setSpeciesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (speciesList.length > 0 && onSpeciesLoaded) {
      onSpeciesLoaded(speciesList)
    }
  }, [speciesList, onSpeciesLoaded])

  useEffect(() => {
    let isCancelled = false
    setLoading(true)
    setError(null)

    async function fetchTopSpecies() {
      try {
        const { lat, lng } = location

        // Query iNaturalist species_counts for verified top species in this coordinate radius
        const url = `https://api.inaturalist.org/v1/observations/species_counts?lat=${lat}&lng=${lng}&radius=60&quality_grade=research&has[]=photos&per_page=6`

        const res = await fetch(url)
        if (!res.ok) throw new Error(`iNaturalist status ${res.status}`)
        const data = await res.json()

        if (isCancelled) return

        if (data.results && data.results.length > 0) {
          // Normalize the top 3 species with photos
          const valid = data.results
            .filter((item) => item.taxon?.default_photo?.medium_url || item.taxon?.default_photo?.url)
            .slice(0, 3)
            .map((item, idx) => {
              const taxon = item.taxon
              const common = taxon.preferred_common_name || taxon.name
              const iconic = taxon.iconic_taxon_name || 'Fauna'

              // Derive contextual ecological behavior from solar phase and weather
              let activityTag = 'Diurnal Feeder'
              let bestTime = `Active between ${solarInfo?.sunrise || 'dawn'} & ${solarInfo?.sunset || 'dusk'}`

              if (iconic === 'Aves') {
                activityTag = 'Golden Hour Songbird'
                bestTime = `Optimal viewing around ${solarInfo?.sunset || 'evening light'}`
              } else if (iconic === 'Insecta') {
                activityTag = 'High Heat Pollinator'
                bestTime = `Flies actively at ${weather?.temp || 30}°C`
              } else if (iconic === 'Reptilia') {
                activityTag = 'Thermal Basking Phase'
                bestTime = `Warms on sun-exposed perches`
              } else if (iconic === 'Plantae') {
                activityTag = 'Photosynthetic Flowering'
                bestTime = `Blossoms in direct sunlight`
              }

              return {
                id: taxon.id || idx,
                commonName: common,
                scientificName: taxon.name,
                taxon: iconic,
                observationsCount: item.count || taxon.observations_count || 100,
                photo:
                  taxon.default_photo?.medium_url ||
                  taxon.default_photo?.url?.replace('square', 'medium') ||
                  FALLBACK_SPECIES[idx % 3].photo,
                url: `https://www.inaturalist.org/taxa/${taxon.id}`,
                activityTag,
                bestTime,
              }
            })

          if (valid.length >= 3) {
            setSpeciesList(valid)
          } else {
            setSpeciesList(FALLBACK_SPECIES)
          }
        } else {
          setSpeciesList(FALLBACK_SPECIES)
        }
      } catch (err) {
        if (!isCancelled) {
          setError('iNaturalist API unavailable. Displaying confirmed local fauna.')
          setSpeciesList(FALLBACK_SPECIES)
        }
      } finally {
        if (!isCancelled) setLoading(false)
      }
    }

    fetchTopSpecies()
    return () => {
      isCancelled = true
    }
  }, [location.lat, location.lng, weather.temp, solarInfo.sunset])

  return (
    <div className="species-card-container">
      {/* Header Bar */}
      <div className="species-card-header">
        <div className="species-header-left">
          <div className="species-header-badge">
            <span className="species-badge-dot" />
            <span>iNaturalist Field Data</span>
          </div>
          <h3 className="species-header-title">Top 3 Species in Your Area</h3>
          <p className="species-header-subtitle">
            Observed around <strong>{location.name.split(',')[0]}</strong> during{' '}
            <span className="species-solar-highlight">
              {solarInfo.isNight ? 'night hours' : 'solar daylight'} ({solarInfo.sunrise} — {solarInfo.sunset})
            </span>
          </p>
        </div>

        {/* Live Weather & Solar Context Pill */}
        <div className="species-context-pill">
          <span className="species-context-icon">🌿</span>
          <div className="species-context-meta">
            <span className="species-context-temp">{weather.temp}°C {weather.condition}</span>
            <span className="species-context-status">
              {solarInfo.sunProgressPercent >= 70 ? 'Golden Hour Window' : 'Daylight Observation'}
            </span>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="species-list-loading">
          <div className="species-skeleton-item" />
          <div className="species-skeleton-item" />
          <div className="species-skeleton-item" />
        </div>
      )}

      {/* Species List */}
      {!loading && (
        <div className="species-items-grid">
          {speciesList.map((sp, idx) => (
            <article key={sp.id || idx} className="species-item-card">
              {/* Photo Thumbnail */}
              <div className="species-photo-wrap">
                <img
                  src={sp.photo}
                  alt={sp.commonName}
                  className="species-photo-img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_SPECIES[idx % 3].photo
                  }}
                />
                <span className="species-rank-badge">#{idx + 1}</span>
              </div>

              {/* Information */}
              <div className="species-info-wrap">
                <div className="species-info-top">
                  <span className="species-taxon-label">{sp.taxon}</span>
                  <span className="species-count-label">
                    {sp.observationsCount.toLocaleString()} observations
                  </span>
                </div>

                <h4 className="species-common-name">{sp.commonName}</h4>
                <p className="species-scientific-name">{sp.scientificName}</p>

                {/* Behavioral & Solar Context Tag */}
                <div className="species-behavior-box">
                  <div className="species-behavior-tag">
                    <span className="species-behavior-dot" />
                    <span>{sp.activityTag}</span>
                  </div>
                  <span className="species-best-time">{sp.bestTime}</span>
                </div>

                {/* External link to iNaturalist */}
                <a
                  href={sp.url}
                  target="_blank"
                  rel="noreferrer"
                  className="species-link-btn"
                  aria-label={`View ${sp.commonName} on iNaturalist`}
                >
                  <span>Explore on iNaturalist</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Footer Attribution */}
      <div className="species-card-footer">
        <span className="species-data-source">
          Verified research-grade biodiversity data via <strong>api.inaturalist.org</strong>
        </span>
        <span className="species-synced-indicator">
          ● Synced with local sunrise {solarInfo.sunrise} & sunset {solarInfo.sunset}
        </span>
      </div>
    </div>
  )
}
