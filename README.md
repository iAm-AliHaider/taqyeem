# تقييم | Taqyeem

**Saudi Arabia's National Business Review Platform** — A polished, demo-ready PWA built with Next.js 15.

## Features
- 5 fully-functional pages with mock data
- Nafath-verified review simulation
- Geofence verification animation
- Animated tier badges (Platinum/Gold/Silver/Bronze/Red Flag)
- National leaderboard with podium
- RTL Arabic support
- PWA manifest

## Tech Stack
- Next.js 15 (App Router, standalone output)
- Tailwind CSS v3
- Framer Motion animations
- TypeScript

## Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Deploy to Coolify

### Method 1: Docker (Recommended)

1. **In Coolify dashboard**, create a new "Docker Compose" service
2. Point to your Git repo or upload files
3. Coolify will auto-detect `docker-compose.yml`
4. Set environment variables from `.env.example`
5. Deploy

### Method 2: Nixpacks / Buildpack

1. Create a new "Application" in Coolify
2. Select your Git repo
3. Build command: `npm run build`
4. Start command: `node .next/standalone/server.js`
5. Set `PORT=3000`

### Method 3: Manual Docker

```bash
# Build
docker build -t taqyeem .

# Run
docker run -p 3000:3000 taqyeem
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, leaderboard preview, pricing |
| `/explore` | Browse & filter all 15 Saudi businesses |
| `/business/[id]` | Business profile (try `/business/stc`) |
| `/review/[id]` | 3-step review wizard with geofence animation |
| `/leaderboard` | National rankings with podium |

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

## Coolify-Specific Notes

- App runs on port `3000` by default
- Health check endpoint: `GET /` (returns 200)
- All routes are client-side rendered (no API routes needed for MVP)
- Static assets in `/public` are served directly

---

Built for Vision 2030 🇸🇦
