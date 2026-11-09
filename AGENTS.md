# AGENTS.md: IKAS (I Know A Spot)

> Standing project norms, imported by `CLAUDE.md`. Human-edited. Norms only:
> safety rules live in `CLAUDE.md` and must not be duplicated or contradicted
> here. One concern lives in exactly one file. Cap: keep this under ~200 lines;
> if it grows past that, move procedure into a skill, not into more prose.

## Code style

- TypeScript, 2-space indent, single quotes, no semicolons; import app code via the `@/` alias; pages are default exports, components and hooks are named exports; data access goes through `src/services/` and is consumed via TanStack Query hooks in `src/hooks/`.
- Match the surrounding file's conventions before applying general style rules.
- No commented-out code in commits; delete it; git remembers.

## Testing norms

- New behavior gets a test when a test harness exists; bug fixes get a
  regression test reproducing the bug first.
- Do not weaken or skip existing tests to make a change pass; report the
  conflict instead.

## Git conventions

- Branch naming: `feat/<slug>` or `fix/<slug>` (matching the `feat:` / `fix:` commit prefixes)
- Commit messages: imperative summary line; body explains *why*, not *what*.
- One logical change per commit; docs affected by a change land in the same
  commit as the change.

## Review bar

- Solo project: `npm run build` and `npm run lint` must pass before pushing to `main` (Vercel deploys from `main`).
- Self-review the diff before declaring work ready; run the project's test and
  lint commands (see `CLAUDE.md` → Project facts) rather than asserting them.
- CI (`.github/workflows/ci.yml`) runs lint, type-check and build on every PR; merge only when its "Lint and build" check is green.
- **UI changes include screenshots at the target viewports.** A description of
  what it looks like is not evidence of what it looks like.
- **Non-trivial work carries an independent pass**, a `verify` or `challenge`
  subagent rather than the author re-reading their own diff, or a stated reason
  it could not run.

## Documentation norms

- Update docs in the same commit as the behavior they describe.
- Do not create new documentation files unless asked; prefer updating the
  existing home for a topic.

## Project-specific notes

- Supabase migrations in `supabase/migrations/` are append-only: add a new timestamped file rather than editing one that has already been applied to the hosted project.
- The app must keep working with Supabase unconfigured (no `.env`): services return empty results via `isSupabaseConfigured()`.
- Geocoding uses the public Nominatim and Photon APIs from the browser (`src/lib/reverse-geocode.ts`); keep request volume low (debounced, no per-keystroke bursts).
- `scripts/clear-supabase-data.mjs` wipes data and needs the service-role key; never run it without an explicit request.
