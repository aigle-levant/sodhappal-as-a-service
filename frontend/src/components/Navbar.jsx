import { useState, useRef, useEffect } from 'react'
import './Navbar.css'

export default function Navbar({
  brandName = 'nudge',
  items = [
    {
      id: 'platform',
      label: 'Platform',
      hasDropdown: true,
      dropdownItems: [
        { title: 'Overview', desc: 'Core platform features and capabilities', href: '#platform-overview' },
        { title: 'Species Intelligence', desc: 'Real-time biodiversity and field observations', href: '#species' },
        { title: 'Art Match Engine', desc: 'Curatorial connections to museum archives', href: '#artwork' },
        { title: 'Solar Ephemeris', desc: 'Golden hour & atmospheric light calculations', href: '#golden-hour' },
      ],
    },
    {
      id: 'use-cases',
      label: 'Use Cases',
      hasDropdown: true,
      dropdownItems: [
        { title: 'For Explorers & Naturalists', desc: 'Discover wildlife at the perfect golden hour', href: '#explorers' },
        { title: 'For Cultural Institutions', desc: 'Bring permanent collections into modern narratives', href: '#institutions' },
        { title: 'For Educational Research', desc: 'Cross-disciplinary nature and art exploration', href: '#research' },
      ],
    },
    {
      id: 'partners',
      label: 'Partners',
      hasDropdown: false,
      href: '#partners',
    },
  ],
  ctaText = 'Contact',
  onCtaClick,
}) {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDropdown = (id) => {
    setActiveDropdown((prev) => (prev === id ? null : id))
  }

  const handleCta = () => {
    if (onCtaClick) {
      onCtaClick()
    } else {
      const contactEl = document.querySelector('#contact') || document.querySelector('#explore')
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' })
      } else {
        alert('Contact modal / explore triggered!')
      }
    }
  }

  return (
    <div className="nudge-nav-wrapper" ref={navRef}>
      <header className="nudge-navbar" aria-label="Main Navigation">
        {/* Left: Brand Logo */}
        <a href="#home" className="nudge-brand" aria-label={brandName}>
          <div className="nudge-logo-mark" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              {/* Sleek geometric arch / nudge motif */}
              <circle cx="12" cy="12" r="10" fill="currentColor" />
              <path
                d="M8 12.5C8 10.0147 10.0147 8 12.5 8C14.9853 8 17 10.0147 17 12.5V16H13.5V12.5C13.5 11.9477 13.0523 11.5 12.5 11.5C11.9477 11.5 11.5 11.9477 11.5 12.5V16H8V12.5Z"
                fill="#ece7de"
              />
            </svg>
          </div>
          <span className="nudge-brand-text">{brandName}</span>
        </a>

        {/* Right Nav Links & CTA */}
        <nav className="nudge-nav-links">
          {items.map((item) => (
            <div
              key={item.id}
              className={`nudge-nav-item ${activeDropdown === item.id ? 'nudge-nav-item--open' : ''}`}
              onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.id)}
              onMouseLeave={() => item.hasDropdown && setActiveDropdown(null)}
            >
              {item.hasDropdown ? (
                <button
                  type="button"
                  className="nudge-nav-link nudge-nav-link--dropdown"
                  onClick={() => toggleDropdown(item.id)}
                  aria-expanded={activeDropdown === item.id}
                >
                  <span>{item.label}</span>
                  <svg
                    className="nudge-chevron"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              ) : (
                <a href={item.href || `#${item.id}`} className="nudge-nav-link">
                  {item.label}
                </a>
              )}

              {/* Dropdown Menu */}
              {item.hasDropdown && (
                <div
                  className={`nudge-dropdown-menu ${
                    activeDropdown === item.id ? 'nudge-dropdown-menu--visible' : ''
                  }`}
                  role="menu"
                >
                  {item.dropdownItems.map((sub, idx) => (
                    <a
                      key={idx}
                      href={sub.href}
                      className="nudge-dropdown-item"
                      role="menuitem"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <span className="nudge-dropdown-item-title">{sub.title}</span>
                      {sub.desc && <span className="nudge-dropdown-item-desc">{sub.desc}</span>}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Action Button: Contact */}
          <button
            type="button"
            className="nudge-btn-contact"
            onClick={handleCta}
            aria-label={ctaText}
          >
            {ctaText}
          </button>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className={`nudge-mobile-burger ${mobileMenuOpen ? 'nudge-mobile-burger--active' : ''}`}
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="nudge-mobile-panel">
          {items.map((item) => (
            <div key={item.id} className="nudge-mobile-item">
              <a
                href={item.href || `#${item.id}`}
                className="nudge-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
              {item.hasDropdown && (
                <div className="nudge-mobile-subitems">
                  {item.dropdownItems?.map((sub, sIdx) => (
                    <a
                      key={sIdx}
                      href={sub.href}
                      className="nudge-mobile-sublink"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {sub.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            className="nudge-btn-contact nudge-btn-contact--mobile"
            onClick={() => {
              setMobileMenuOpen(false)
              handleCta()
            }}
          >
            {ctaText}
          </button>
        </div>
      )}
    </div>
  )
}
