# CLAUDE.md: IKAS (I Know A Spot)

@AGENTS.md

<!-- claude-framework:installed rev=2.0.0, marker used by the install-framework skill; do not remove -->

> This file governs the coding agent in this project. It is deliberately small.
> Policy and authority live here; standing project norms live in `AGENTS.md`
> (imported above, the only import); procedures live in skills; hard
> enforcement lives in hooks. Do not grow this file: route instead.

## If the import fails

If `AGENTS.md` is missing or unreadable: say so once, then continue. Every
safety rule you are required to obey is in **this** file. `AGENTS.md` carries
norms, never safety.

## Project facts

- What this is: A Yelp-style web app for discovering and sharing scenic viewpoints: React 19 + Vite + Tailwind v4 frontend, Supabase (Auth, Postgres + PostGIS, Storage) backend, deployed on Vercel.
- Start: `npm run dev`
- Test: `none`
- Lint: `npm run lint`

If a listed command fails or does not exist, report it. Do not invent a
replacement or claim it ran.

## Authority order (highest wins on conflict)

1. The user's explicit instruction in this session, but user authority
   operates *within* hook constraints: a hook block is enforcement, not advice
2. Hooks, the hard gates: a PreToolUse exit-2 block is final, never worked
   around. The only legitimate override is the user editing hook
   configuration, never you bypassing the gate
3. This file
4. `AGENTS.md`
5. Skill instructions (`.claude/skills/`)
6. Your own defaults

## Safety boundaries

- **Secrets:** secret files are **read-forbidden**, not just quote-forbidden:
  never open `.env` or credential files; their contents must not enter your
  context. `.env.example` is the only permitted source for variable names.
  Never print, commit, or copy secret values.
- **Destructive git** (`push --force`, `reset --hard`, `clean -f`, branch
  deletion): only on explicit user request.
- **Scope preservation:** implement what was asked. Do not refactor, delete,
  or "improve" beyond the stated task; surplus is a defect, not a bonus.
- **No silent adaptation:** if reality contradicts an instruction or an
  assumption breaks mid-task, stop and report rather than improvising.

## Capabilities degrade, they never block

MCP servers (context7 for library docs, playwright and chrome-devtools for the browser)
are **recommended defaults, never preconditions**. Check availability at the
point of use; if a server or tool is absent, fall back to native tools
(Read/Grep/Glob/Bash) and say which fallback you used. Never name or wait for
a tool this project has not configured.

> Rough goal, cold start? `/prompt <what you want>` reads what is already known, picks the
> shape of the work and the tool that proves it, asks only the gaps, then does it.
> Procedure: `/Users/nicholasp/Personal Coding/claude-framework-main/.claude/skills/prompt/SKILL.md`.

## Definition of done

Work is done when, and only when:

1. The change does what was asked, nothing more.
2. The Test and Lint commands under Project facts ran and passed. A slot that
   reads `none` has no command to run: say that in the summary rather than
   claiming a pass.
3. Every factual claim in your summary is backed by a command you actually ran
   in this session: counts, paths, and states come from output, not memory.
4. Evidence is proportional to risk: a typo fix needs a glance, a migration
   needs the full verification ladder. Do not gold-plate low-risk changes.
5. **A UI change has been looked at.** Anything a human sees, a page, a screen,
   a terminal view, a generated chart, is run, screenshotted at the target
   viewports, and the images read before the claim. A green test proves the code
   did what the code says, never what the user sees. Procedure:
   `/Users/nicholasp/Personal Coding/claude-framework-main/.claude/skills/visual-verify/SKILL.md`.
6. **An independent pass ran, or the summary says why it could not.** For any
   non-trivial completion claim, a `verify` or `challenge` subagent audits the
   work with no inherited context. Self-review is not independent verification:
   the agent that wrote the bug is the one least able to see it. If a quota or
   an outage blocked the pass, say so in the summary and say what you did
   instead; never drop to self-review silently.

Never state a number you did not derive from a command.

## Subagents

Framework subagents come from the loaded plugin (namespaced `claude-framework:*`) or
from `.claude/agents/` if vendored there. Use them for independent verification (they
don't inherit your assumptions). Roster and usage:
`/Users/nicholasp/Personal Coding/claude-framework-main/docs/subagent-guide.md`. For parallel or risky work, prefer
native isolation: subagents, plan mode, and `--worktree`.

## Where deeper guidance lives

| Topic | Location |
|---|---|
| Planning & when to plan | `/Users/nicholasp/Personal Coding/claude-framework-main/docs/planning.md` |
| Doc/code lookup routing | `/Users/nicholasp/Personal Coding/claude-framework-main/docs/guardrails/documentation-exploration-protocol.md` |
| Scope & evidence policy | `/Users/nicholasp/Personal Coding/claude-framework-main/docs/policies/scope-and-evidence.md` |
| MCP usage (context7, playwright, chrome-devtools) | `/Users/nicholasp/Personal Coding/claude-framework-main/docs/mcp-usage-guide.md` |
| MCP opt-in catalog | `/Users/nicholasp/Personal Coding/claude-framework-main/docs/mcp-opt-in.md` |
| Hooks: contract & examples | `/Users/nicholasp/Personal Coding/claude-framework-main/docs/hooks-configuration-guide.md` |
| Subagent roster & patterns | `/Users/nicholasp/Personal Coding/claude-framework-main/docs/subagent-guide.md` |

> **Machine-local routes:** this project uses plugin-only mode, so the paths above point
> at the framework source on this machine (`/Users/nicholasp/Personal Coding/claude-framework-main`). If the framework moves or
> another machine is used, re-run the install-framework skill to rewrite them.

## What this file deliberately omits

Skill bodies, hook logic, MCP schemas, tool inventories, numeric performance
budgets, and workflow rituals. If a rule cannot be enforced by a hook, checked
by a command, or found at one of the routes above, it does not belong here.
