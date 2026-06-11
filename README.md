# Portfolio — Amine Chaieb

A full-stack personal portfolio with a React frontend, Node.js/Express backend, and MongoDB database.

## Project Structure

```
Portfolio-main/
├── client/         # React + Vite + Tailwind frontend
└── server/         # Express + Mongoose backend
```

## Quick Start

### 1. Backend

```bash
cd server
npm install
# Edit .env — set MONGODB_URI, JWT_SECRET, BACKEND_URL, PORT
node server.js
# Optional: seed sample data
node seed.js
```

### 2. Frontend

```bash
cd client
npm install
# Edit .env — set VITE_API_URL (default: http://localhost:5000/api)
npm run dev
```

### 3. First-time setup

Visit `http://localhost:5173/login` and register your admin account (only the first registration is allowed).

## Environment Variables

### server/.env
| Variable | Example |
|---|---|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `JWT_SECRET` | `change_me_to_a_random_string` |
| `PORT` | `5000` |
| `BACKEND_URL` | `http://localhost:5000` |

### client/.env
| Variable | Example |
|---|---|
| `VITE_API_URL` | `http://localhost:5000/api` |

## Features

- **Projects** — showcase with GitHub/live links, featured flag, tech stack tags
- **Skills** — progress bars grouped by category
- **Designs** — image gallery with tool tags and hover overlay
- **Events & Competitions** — timeline with achievement badges
- **Certificates** — credential cards with issue date and verification link
- **Clubs & Orgs** — role, period, and achievements list
- **Contact** — form with confetti on success, messages stored in DB
- **Admin Dashboard** — full CRUD for all content, settings, avatar upload, theme colors
- **Auth** — JWT-based single-admin login
