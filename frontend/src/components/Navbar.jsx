import { useState } from 'react'
import './Navbar.css'

export default function Navbar({
  brandName = 'WildCanvas',
  onSearch,
  placeholder = 'Search city or species...',
}) {
  const [query, setQuery] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return

    if (onSearch) {
      onSearch(trimmed)
    }
  }

  const handleClear = () => {
    setQuery('')
  }

  return (
    <div className="nudge-nav-wrapper">
      <header className="nudge-navbar" aria-label="Main Navigation">
        {/* Left: Brand Logo with Leaf Icon */}
        <a href="#home" className="nudge-brand" aria-label={brandName}>
          <div className="wild-leaf-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              {/* Organic Botanical Leaf */}
              <path
                d="M20.2 3.8C20.2 3.8 13.8 3.6 8.9 8.5C4 13.4 3.8 19.8 3.8 19.8C3.8 19.8 10.2 20 15.1 15.1C20 10.2 20.2 3.8 20.2 3.8Z"
                fill="#285943"
                stroke="#16352F"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 20L13.2 10.8"
                stroke="#F5F1E8"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M10 14L13.5 14.5"
                stroke="#F5F1E8"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M13.2 10.8L13.7 7.3"
                stroke="#F5F1E8"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="nudge-brand-text">{brandName}</span>
        </a>

        {/* Right: Search Bar */}
        <form className="wild-nav-search" onSubmit={handleSubmit} role="search">
          <svg
            className="wild-nav-search-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            type="search"
            className="wild-nav-search-input"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search city or species"
          />

          {query && (
            <button
              type="button"
              className="wild-nav-search-clear"
              onClick={handleClear}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}

          <button type="submit" className="wild-nav-search-btn" aria-label="Submit search">
            Search
          </button>
        </form>
      </header>
    </div>
  )
}
