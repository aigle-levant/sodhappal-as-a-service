# Hackathon Starter 🚀

A minimal, production-ready hackathon template.
**Frontend**: React 19 + Vite + JSX + ESLint
**Backend**: Node.js + Express — 4 API proxy routes pre-wired.

---

## Project Structure

```
sodhappal-as-a-service/
├── frontend/                  # React + Vite (port 5173)
│   ├── src/
│   │   ├── services/api.js    # Fetch client — api1..api4 namespaces
│   │   ├── hooks/useApi.js    # useApi(fn) hook for loading/error/data
│   │   ├── App.jsx            # Root component
│   │   ├── App.css            # Layout styles
│   │   └── index.css          # Global design system (tokens, components)
│   ├── eslint.config.js       # ESLint flat config (react + hooks + refresh)
│   └── vite.config.js         # Dev proxy → backend :3001
│
└── backend/                   # Express server (port 3001)
    ├── server.js              # Entry point, middleware, routes mounted
    ├── lib/apiClient.js       # Shared Axios factory (auth, logging, errors)
    ├── routes/
    │   ├── api1.js            # /api/api1/*
    │   ├── api2.js            # /api/api2/*
    │   ├── api3.js            # /api/api3/*
    │   └── api4.js            # /api/api4/*
    └── .env.example           # Copy to .env and fill in keys
```

---

## Quick Start

### 1. Set up environment variables

```bash
cp backend/.env.example backend/.env
# Edit backend/.env and fill in your API keys
```

### 2. Run the backend

```bash
cd backend
npm run dev        # nodemon — auto-restarts on changes
```

### 3. Run the frontend

```bash
cd frontend
npm run dev        # Vite — HMR on http://localhost:5173
```

> The Vite dev server proxies `/api/*` → `http://localhost:3001`
> so there are **no CORS issues** during development.

---

## Wiring up an API

When you receive your hackathon API details:

**1. Update `.env`**
```env
API1_BASE_URL=https://real-api.example.com
API1_KEY=sk-xxxxx
```

**2. Add routes in `backend/routes/api1.js`**
```js
router.get('/search', async (req, res, next) => {
  try {
    const { data } = await client.get('/v1/search', { params: req.query })
    res.json(data)
  } catch (err) { next(err) }
})
```

**3. Call from the frontend via `src/services/api.js`**
```js
import { api1 } from './services/api'
const results = await api1.get('/search', { q: 'hello' })
```

---

## Scripts

| Directory  | Command         | Description              |
|------------|-----------------|--------------------------|
| `backend`  | `npm run dev`   | nodemon dev server       |
| `backend`  | `npm start`     | production start         |
| `frontend` | `npm run dev`   | Vite HMR dev server      |
| `frontend` | `npm run build` | production build         |
| `frontend` | `npm run lint`  | ESLint check             |
