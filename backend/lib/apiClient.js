/**
 * lib/apiClient.js — Shared Axios instance factory
 *
 * Each API router uses createClient() to get a pre-configured
 * Axios instance with baseURL + auth headers already set.
 */

import axios from 'axios'

/**
 * @param {string} baseURL  - e.g. process.env.API1_BASE_URL
 * @param {string} apiKey   - e.g. process.env.API1_KEY
 * @param {object} [extra]  - any extra default headers
 */
export function createClient(baseURL, apiKey, extra = {}) {
  const client = axios.create({
    baseURL,
    timeout: 10_000,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type':  'application/json',
      ...extra,
    },
  })

  // Request interceptor — log outgoing calls in dev
  client.interceptors.request.use((config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`  → [${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`)
    }
    return config
  })

  // Response interceptor — normalise errors
  client.interceptors.response.use(
    (res) => res,
    (err) => {
      const status  = err.response?.status  || 500
      const message = err.response?.data?.message || err.message || 'Upstream API error'
      const error   = new Error(message)
      error.status  = status
      return Promise.reject(error)
    },
  )

  return client
}
