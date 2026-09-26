/**
 * routes/api1.js
 *
 * Proxy router for API 1.
 * Rename this file and update server.js when you know the real API name.
 *
 * Base URL : process.env.API1_BASE_URL
 * Auth key : process.env.API1_KEY
 */

import { Router } from 'express'
import { createClient } from '../lib/apiClient.js'

const router = Router()
const client = createClient(process.env.API1_BASE_URL, process.env.API1_KEY)

// ─── Health / ping ────────────────────────────────────────────────────────────
// GET /api/api1/ping
router.get('/ping', async (_req, res, next) => {
  try {
    // Replace '/' with the actual health endpoint of API 1
    const { data } = await client.get('/')
    res.json(data)
  } catch (err) {
    // Fallback so the FE ping card still lights up during dev
    if (process.env.NODE_ENV === 'development') {
      return res.json({ pong: 'api1', note: 'Upstream not reachable — stub response' })
    }
    next(err)
  }
})

// ─── Add your routes below ────────────────────────────────────────────────────
//
// Example:
//   GET /api/api1/search?q=hello
// router.get('/search', async (req, res, next) => {
//   try {
//     const { data } = await client.get('/search', { params: req.query })
//     res.json(data)
//   } catch (err) { next(err) }
// })

export default router
