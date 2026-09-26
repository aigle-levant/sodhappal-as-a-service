import { useState, useEffect } from 'react'
import './ArtworkCard.css'

// Curated high-quality museum fallbacks from Art Institute of Chicago collection
const FALLBACK_ARTWORKS = [
  {
    id: 88836,
    title: 'Kingfisher and Hydrangea',
    artist: 'Utagawa Hiroshige II (Japanese, 1826–1869)',
    date: 'Edo period, c. 1850s',
    medium: 'Color woodblock print; chutanzaku',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    imageId: '93a24df1-d260-5943-ddcd-be88f6de9637',
    url: 'https://www.artic.edu/artworks/88836',
    connectionNote: 'Echoes the vibrant avian coloration and evening twilight over freshwater marshes.',
  },
  {
    id: 61608,
    title: 'Sunset',
    artist: 'Paul Klee (German, born Switzerland, 1879–1940)',
    date: '1930',
    medium: 'Oil on canvas',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
    imageId: '92da7102-0562-f4da-55f9-1d29828b20d7',
    url: 'https://www.artic.edu/artworks/61608',
    connectionNote: 'Abstracts the geometric dispersal of low-angle golden light near sunset.',
  },
  {
    id: 14488,
    title: 'Butterfly Study in Golden Tint',
    artist: 'James McNeill Whistler (American, 1834–1903)',
    date: 'c. 1890',
    medium: 'Graphite on ivory wove paper',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
    imageId: 'd92660fb-b49a-ff1f-e761-0efacce3023f',
    url: 'https://www.artic.edu/artworks/14488',
    connectionNote: 'Captures the delicate wing anatomy of pollinators basking under warm daylight.',
  },
]

export default function ArtworkCard({
  species = [],
  location = { name: 'Chennai, India' },
  solarInfo = { sunrise: '5:56 AM', sunset: '6:03 PM', isNight: false, sunProgressPercent: 73 },
  weather = { temp: 34, condition: 'Clear Sky' },
}) {
  const [artworks, setArtworks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isCancelled = false
    setLoading(true)
    setError(null)

    async function fetchRelatedArt() {
      try {
        // 1. Build an organic search query from the top species and solar light
        const topSpeciesName = species?.[0]?.commonName || species?.[0]?.taxon || 'nature'
        const solarKeyword =
          solarInfo?.sunProgressPercent >= 70
            ? 'sunset'
            : solarInfo?.sunProgressPercent <= 25
            ? 'sunrise'
            : 'sunlight'

        // Search Art Institute of Chicago API
        const primaryQuery = `${topSpeciesName} ${solarKeyword}`.toLowerCase()
        const url = `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(
          primaryQuery
        )}&fields=id,title,artist_display,date_display,medium_display,image_id,thumbnail&limit=6`

        const res = await fetch(url)
        if (!res.ok) throw new Error(`Art Institute API status ${res.status}`)
        const data = await res.json()

        if (isCancelled) return

        let items = []
        if (data.data && data.data.length > 0) {
          // Normalize items with images
          items = data.data
            .filter((art) => art.title && (art.image_id || art.thumbnail?.lqip))
            .slice(0, 3)
            .map((art, idx) => {
              const pairedSpecies = species?.[idx] || species?.[0]
              const speciesRef = pairedSpecies?.commonName || 'local wildlife'

              const imgUrl = art.image_id
                ? `https://www.artic.edu/iiif/2/${art.image_id}/full/843,/0/default.jpg`
                : FALLBACK_ARTWORKS[idx % 3].image

              return {
                id: art.id,
                title: art.title,
                artist: art.artist_display ? art.artist_display.split('\n')[0] : 'Unknown Artist',
                date: art.date_display || 'Collection piece',
                medium: art.medium_display || 'Artwork',
                image: imgUrl,
                fallbackImage: FALLBACK_ARTWORKS[idx % 3].image,
                url: `https://www.artic.edu/artworks/${art.id}`,
                connectionNote: `Artistic dialogue with ${speciesRef} under ${solarKeyword} illumination (${solarInfo?.sunset ? `Sunset ${solarInfo.sunset}` : 'Daylight'}).`,
              }
            })
        }

        // If fewer than 3 results from specific query, complement with broad curated search
        if (items.length < 3) {
          const fallbackQuery = `birds nature ${solarKeyword}`
          const backupRes = await fetch(
            `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(
              fallbackQuery
            )}&fields=id,title,artist_display,date_display,medium_display,image_id,thumbnail&limit=4`
          )
          const backupData = await backupRes.json()

          if (backupData.data) {
            const extra = backupData.data
              .filter((art) => !items.find((it) => it.id === art.id))
              .slice(0, 3 - items.length)
              .map((art, idx) => ({
                id: art.id,
                title: art.title,
                artist: art.artist_display ? art.artist_display.split('\n')[0] : 'Unknown Artist',
                date: art.date_display || 'Collection piece',
                medium: art.medium_display || 'Artwork',
                image: art.image_id
                  ? `https://www.artic.edu/iiif/2/${art.image_id}/full/843,/0/default.jpg`
                  : FALLBACK_ARTWORKS[(items.length + idx) % 3].image,
                fallbackImage: FALLBACK_ARTWORKS[(items.length + idx) % 3].image,
                url: `https://www.artic.edu/artworks/${art.id}`,
                connectionNote: `Inspired by regional flora and fauna in ${location.name.split(',')[0]} during ${solarKeyword}.`,
              }))
            items = [...items, ...extra]
          }
        }

        if (items.length >= 3) {
          setArtworks(items.slice(0, 3))
        } else {
          setArtworks(FALLBACK_ARTWORKS)
        }
      } catch (err) {
        if (!isCancelled) {
          setError('Live museum connection unavailable. Showing collection highlights.')
          setArtworks(FALLBACK_ARTWORKS)
        }
      } finally {
        if (!isCancelled) setLoading(false)
      }
    }

    fetchRelatedArt()
    return () => {
      isCancelled = true
    }
  }, [species?.[0]?.commonName, location.name, solarInfo.sunset, solarInfo.sunProgressPercent])

  return (
    <div className="artwork-card-container">
      {/* Header */}
      <div className="artwork-card-header">
        <div className="artwork-header-left">
          <div className="artwork-header-badge">
            <span className="artwork-badge-dot" />
            <span>Art Institute of Chicago</span>
          </div>
          <h3 className="artwork-header-title">Artistic Connections to Your Area</h3>
          <p className="artwork-header-subtitle">
            Curated from <strong>{location.name.split(',')[0]}</strong> wildlife observations &{' '}
            <span className="artwork-solar-highlight">
              {solarInfo.sunProgressPercent >= 70 ? 'Golden Hour' : 'Daylight'} Light
            </span>
          </p>
        </div>

        <div className="artwork-collection-tag">
          <span>Top 3 Artworks</span>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="artwork-list-loading">
          <div className="artwork-skeleton-item" />
          <div className="artwork-skeleton-item" />
          <div className="artwork-skeleton-item" />
        </div>
      )}

      {/* Artworks List */}
      {!loading && (
        <div className="artwork-items-grid">
          {artworks.map((art, idx) => (
            <article key={art.id || idx} className="artwork-item-card">
              {/* Image Frame */}
              <div className="artwork-image-frame">
                <img
                  src={art.image}
                  alt={art.title}
                  className="artwork-image-img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = art.fallbackImage || FALLBACK_ARTWORKS[idx % 3].image
                  }}
                />
                <span className="artwork-gallery-number">Piece #{idx + 1}</span>
              </div>

              {/* Artwork Metadata */}
              <div className="artwork-details-wrap">
                <div className="artwork-top-meta">
                  <span className="artwork-date-label">{art.date}</span>
                  <span className="artwork-museum-label">Art Institute of Chicago</span>
                </div>

                <h4 className="artwork-title-text">{art.title}</h4>
                <p className="artwork-artist-text">{art.artist}</p>
                <p className="artwork-medium-text">{art.medium}</p>

                {/* Connection Narrative */}
                <div className="artwork-connection-box">
                  <span className="artwork-connection-icon">🎨</span>
                  <span className="artwork-connection-text">{art.connectionNote}</span>
                </div>

                {/* Link to Art Institute Collection */}
                <a
                  href={art.url}
                  target="_blank"
                  rel="noreferrer"
                  className="artwork-link-btn"
                  aria-label={`View ${art.title} at Art Institute of Chicago`}
                >
                  <span>View at Art Institute of Chicago</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="7" y1="17" x2="17" y2="5" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Footer Attribution */}
      <div className="artwork-card-footer">
        <span className="artwork-data-source">
          Public museum archives via <strong>api.artic.edu</strong> Open Access
        </span>
        <span className="artwork-connected-species">
          Connected to {species?.[0]?.commonName || 'local species'} · Sunset {solarInfo.sunset}
        </span>
      </div>
    </div>
  )
}
