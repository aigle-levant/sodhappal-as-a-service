/**
 * App.jsx — Root component
 *
 * Replace the content here with your hackathon UI.
 * The starter Demo section shows how to call all 4 APIs.
 */

import { useState } from 'react'
import { api1, api2, api3, api4 } from './services/api'
import { useApi } from './hooks/useApi'
import Navbar from './components/Navbar'
import SolarCard from './components/SolarCard'
import Footer from './components/Footer'
import './App.css'

// ─── Status dot ──────────────────────────────────────────────────────────────
function StatusDot({ ok }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: ok === null ? 'var(--color-text-muted)' : ok ? 'var(--color-success)' : 'var(--color-error)',
        boxShadow: ok ? '0 0 6px var(--color-success)' : 'none',
      }}
    />
  )
}

// ─── API Ping Card ────────────────────────────────────────────────────────────
function ApiCard({ label, apiFn, path = '/ping' }) {
  const { data, loading, error, execute } = useApi(apiFn)
  const ok = data !== null ? true : error ? false : null

  return (
    <div className="card fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{label}</span>
        <StatusDot ok={ok} />
      </div>
      <code style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>GET {path}</code>
      {error && <p style={{ fontSize: '0.75rem', color: 'var(--color-error)' }}>{error}</p>}
      {data  && <pre style={{ fontSize: '0.72rem', color: 'var(--color-success)', overflow: 'auto', maxHeight: 80 }}>{JSON.stringify(data, null, 2)}</pre>}
      <button
        className="btn btn-ghost"
        style={{ alignSelf: 'flex-start' }}
        disabled={loading}
        onClick={() => execute(path)}
      >
        {loading ? <span className="spinner" /> : 'Ping'}
      </button>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [pingedAll, setPingedAll] = useState(false)

  return (
    <div className="app-shell">
      <Navbar />

      {/* Hero */}
      <main className="container" style={{ paddingTop: 140, paddingBottom: 64 }}>
        <section style={{ textAlign: 'center', marginBottom: 64 }}>
          <h1 className="hero-title fade-in">
            Build fast. <span className="gradient-text">Ship faster.</span>
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', marginTop: 12 }}>
            React + Vite frontend · Node + Express backend · 4 API proxy routes wired up.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28 }}>
            <button
              className="btn btn-primary"
              onClick={() => setPingedAll(true)}
            >
              Ping all APIs
            </button>
            <a
              href="http://localhost:3001/health"
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost"
            >
              Backend health ↗
            </a>
          </div>
        </section>

        {/* Live Animated Solar & Weather Card (sunrise-sunset.org API) */}
        <section style={{ display: 'flex', justifyContent: 'flex-start', textAlign: 'left', marginBottom: 64 }}>
          <SolarCard />
        </section>

        {/* API Grid */}
        <section>
          <h2 style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: 20, fontWeight: 500 }}>
            API PROXY ROUTES
          </h2>
          <div className="api-grid">
            {pingedAll && (
              <>
                <ApiCard label="API 1" apiFn={api1.get} path="/ping" />
                <ApiCard label="API 2" apiFn={api2.get} path="/ping" />
                <ApiCard label="API 3" apiFn={api3.get} path="/ping" />
                <ApiCard label="API 4" apiFn={api4.get} path="/ping" />
              </>
            )}
            {!pingedAll && (
              <p style={{ color: 'var(--color-text-muted)', gridColumn: '1/-1', textAlign: 'center', padding: '40px 0' }}>
                Click <strong style={{ color: 'var(--color-text)' }}>Ping all APIs</strong> to test your proxy routes.
              </p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
