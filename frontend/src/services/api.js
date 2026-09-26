/**
 * api.js — Centralized API client
 *
 * All 4 external APIs are accessed through the Express backend at /api/*.
 * The Vite dev proxy forwards these calls to http://localhost:3001.
 *
 * Usage:
 *   import { api1, api2, api3, api4 } from './services/api'
 *   const data = await api1.get('/endpoint')
 */

const BASE_URL = '/api'

// ─── Generic fetch wrapper ────────────────────────────────────────────────────

async function request(method, url, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
  if (body) options.body = JSON.stringify(body)

  const res = await fetch(url, options)

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message || `HTTP ${res.status}`)
  }

  // Return null for 204 No Content
  if (res.status === 204) return null
  return res.json()
}

// ─── API namespace factories ──────────────────────────────────────────────────

function makeClient(prefix) {
  const base = `${BASE_URL}/${prefix}`
  return {
    get:    (path, params) => {
      const url = new URL(base + path, window.location.origin)
      if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
      return request('GET', url.toString())
    },
    post:   (path, body)   => request('POST',   `${base}${path}`, body),
    put:    (path, body)   => request('PUT',     `${base}${path}`, body),
    patch:  (path, body)   => request('PATCH',   `${base}${path}`, body),
    delete: (path)         => request('DELETE',  `${base}${path}`),
  }
}

// ─── The 4 API clients ────────────────────────────────────────────────────────
// Rename these to match your hackathon APIs (e.g. openai, stripe, maps, etc.)

export const api1 = makeClient('api1')
export const api2 = makeClient('api2')
export const api3 = makeClient('api3')
export const api4 = makeClient('api4')
