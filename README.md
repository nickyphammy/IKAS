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

Live site: **https://nickyphammy.github.io/IKAS/**

Pushes to `main` automatically build and deploy via GitHub Actions.

**One-time GitHub setup:** open your repo → **Settings → Pages** → set **Source** to **GitHub Actions**.

Then push this project to `main` and check the **Actions** tab for the deploy workflow.
