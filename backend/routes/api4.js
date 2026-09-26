/**
 * routes/api4.js
 *
 * Proxy router for API 4.
 * Rename this file and update server.js when you know the real API name.
 *
 * Base URL : process.env.API4_BASE_URL
 * Auth key : process.env.API4_KEY
 */

import { Router } from 'express'
import { createClient } from '../lib/apiClient.js'

const router = Router()
const client = createClient(process.env.API4_BASE_URL, process.env.API4_KEY)

// ─── Health / ping ────────────────────────────────────────────────────────────
// GET /api/api4/ping
router.get('/ping', async (_req, res, next) => {
  try {
    const { data } = await client.get('/')
    res.json(data)
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      return res.json({ pong: 'api4', note: 'Upstream not reachable — stub response' })
    }
    next(err)
  }
})

// ─── Add your routes below ────────────────────────────────────────────────────

export default router
