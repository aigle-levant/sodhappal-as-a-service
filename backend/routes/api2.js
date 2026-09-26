/**
 * routes/api2.js
 *
 * Proxy router for API 2.
 * Rename this file and update server.js when you know the real API name.
 *
 * Base URL : process.env.API2_BASE_URL
 * Auth key : process.env.API2_KEY
 */

import { Router } from 'express'
import { createClient } from '../lib/apiClient.js'

const router = Router()
const client = createClient(process.env.API2_BASE_URL, process.env.API2_KEY)

// ─── Health / ping ────────────────────────────────────────────────────────────
// GET /api/api2/ping
router.get('/ping', async (_req, res, next) => {
  try {
    const { data } = await client.get('/')
    res.json(data)
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      return res.json({ pong: 'api2', note: 'Upstream not reachable — stub response' })
    }
    next(err)
  }
})

// ─── Add your routes below ────────────────────────────────────────────────────

export default router
