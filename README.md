# IKAS — I Know A Spot

A Yelp-style web app for discovering and sharing scenic viewpoints. Built with React, Supabase, and deployed on Vercel.

## Features

- Browse recommended and nearby viewpoints
- Explore an interactive map with text search and radius filtering
- Daily recommendation card stack
- Save favorite spots
- Add viewpoints with photos, tags, and ratings
- Email/password and Google OAuth authentication

## Tech stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4
- **Backend:** Supabase (Auth, Postgres + PostGIS, Storage)
- **Deploy:** Vercel

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally (UI only)

The app runs without Supabase configured — all lists show empty states.

```bash
npm run dev
```

### 3. Connect Supabase

**Full step-by-step guide:** [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)

Quick summary:

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env` and fill in your project URL and anon key
3. Apply migrations:

```bash
npx supabase link --project-ref your-project-ref
npx supabase db push
```

Or paste the SQL from `supabase/migrations/` into the Supabase SQL editor.

4. Enable **Google** provider under Authentication → Providers
5. Add redirect URLs:
   - `http://localhost:5173/auth/callback`
   - `https://your-app.vercel.app/auth/callback`

### 4. Build

```bash
npm run build
```

## Curated viewpoints

`npm run curator -- <command>` (`scripts/viewpoint-curator.mjs`) seeds the app with public scenic spots.
Places come from Wikidata (CC0); photos come only from Wikimedia Commons and are accepted only if their
license is public domain / CC0, CC BY or CC BY-SA. NC, ND, GFDL-only and non-free files, files with any
Commons restriction tag (personality rights, trademarks, …) and CC BY/BY-SA photos without an identified
author are rejected. The author, license and source are stored on the viewpoint and shown as a photo credit
in the app.

Candidates are staged in `.curator/` (git-ignored) and nothing reaches Supabase until it is approved:
`discover` → `photos` → `stage` → `list` → `approve` → `publish`. Run the script with no command for the full
reference. `setup` and `publish` need `SUPABASE_SERVICE_ROLE_KEY` in `.env`.

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy — `vercel.json` handles SPA routing

## Project structure

```
src/
├── app/           # Router, auth context, protected routes
├── pages/         # Route pages
├── components/    # UI and feature components
├── hooks/         # TanStack Query hooks
├── services/      # Supabase CRUD
├── lib/           # Utilities, geo helpers, Supabase client
└── types/         # TypeScript types
```

## License

MIT
