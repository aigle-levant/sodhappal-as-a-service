/**
 * server.js — Express entry point
 */

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import api1Router from './routes/api1.js'
import api2Router from './routes/api2.js'
import api3Router from './routes/api3.js'
import api4Router from './routes/api4.js'

const app  = express()
const PORT = process.env.PORT || 3001

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(morgan('dev'))
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: process.env.NODE_ENV })
})

app.use('/api/api1', api1Router)
app.use('/api/api2', api2Router)
app.use('/api/api3', api3Router)
app.use('/api/api4', api4Router)

// ─── 404 catch ────────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ─── Global error handler ─────────────────────────────────────────────────────

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err)
  const status  = err.status || err.statusCode || 500
  const message = err.message || 'Internal Server Error'
  res.status(status).json({ error: message })
})

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🚀  Backend running at http://localhost:${PORT}`)
  console.log(`   Health  → http://localhost:${PORT}/health`)
  console.log(`   API 1   → http://localhost:${PORT}/api/api1`)
  console.log(`   API 2   → http://localhost:${PORT}/api/api2`)
  console.log(`   API 3   → http://localhost:${PORT}/api/api3`)
  console.log(`   API 4   → http://localhost:${PORT}/api/api4\n`)
})

export default app
