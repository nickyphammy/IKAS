# IKAS (I KNOW A SPOT)

Web app similar to Yelp, but for viewpoints.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4

## Requirements

Node.js 20+ (see `.nvmrc`)

```bash
cd IKAS
nvm use          # uses .nvmrc (Node 20) — run `nvm install` once if needed
npm run dev
```

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview build |
| `npm run lint` | ESLint |

## GitHub Pages

**Live site:** https://nickyphammy.github.io/IKAS/

Use that exact URL (include `/IKAS/`). These will **not** work:

- `https://nickyphammy.github.io/` (no project folder)
- `https://github.com/nickyphammy/IKAS` (repo page, not the app)

Pushes to `main` automatically build and deploy via GitHub Actions.

**GitHub settings (one-time):** repo → **Settings → Pages** → **Source: GitHub Actions**. Your screenshot already shows this correctly.

After the first successful deploy, refresh the Pages settings tab — you should see the live URL and last deployment time. If it still says “Workflow details will appear here…”, check the **Actions** tab; the deploy may still be running.

**Sub-pages:** `/home`, `/explore`, etc. work when navigating inside the app. Direct links and refresh are supported via a copied `404.html` (SPA fallback).
