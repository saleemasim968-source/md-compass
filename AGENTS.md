# AGENTS.md — rules for anyone (human or AI) working on MD Compass

Read this file first, then `docs/PRD.md` starting with its section
"Read first: instructions for the AI agent".

## What this project is

MD Compass is a free, accessible web app for people living with limb-girdle
muscular dystrophy (LGMD) and the people who support them: a Research hub, Daily
Living guides, an interactive Timeline of stages of function, and a Community
directory. See `docs/PRD.md`.

## Source of truth and priority order

If two documents disagree, the higher one wins. Report the conflict to the
project owner; do not silently pick one.

1. **Product requirements:** `docs/PRD.md`, the single source of truth. It
   overrides every other file in the project, including this one.
2. **Safety and content rules:** `docs/CONTENT_GUIDELINES.md`
3. **Accessibility rules:** `docs/ACCESSIBILITY.md`
4. **Technical design:** `docs/ARCHITECTURE.md`
5. **Delivery plan:** `docs/ROADMAP.md`
6. **How-to skills:** `.claude/skills/*/SKILL.md`
7. This file's general working rules (below)

## Non-negotiable rules

1. **LGMD only.** Build for limb-girdle muscular dystrophy. Other types of
   muscular dystrophy come later (PRD §7.7) and must not be named anywhere
   outside `docs/PRD.md`, except under "Later" and in a change log.
2. **Keep the multi-condition structure.** Research records and content items
   carry `condition` (value `lgmd`) and an optional `subtype`. A subtype is never
   guessed (PRD R28, E23).
3. **Never write medical content.** No symptoms, causes, stages, ages,
   statistics, treatments, sources or advice, not even as an "example", and not
   from general knowledge. Use a placeholder instead and list it in your report:
   `TODO(content): <what is needed> — source + clinical review required`
4. **No personal data.** No accounts, no forms that store data, no tracking.
   Settings stay on the visitor's device (PRD §14).
5. **Accessibility is a release blocker**, judged against PRD §12, which goes
   beyond WCAG 2.2 AA.
6. **Build only the phase you were asked for.** Do not start later phases from
   `docs/ROADMAP.md`.
7. **Ask instead of guessing.** If a requirement is unclear, missing or
   conflicting, stop and ask the project owner.

## Working rules (PRD §10.1, §14, §15.1)

- Propose a plan (files, dependencies, questions) and wait for approval before
  writing code.
- One checklist item at a time. When you change a file, write the whole file.
- **Stack is fixed** (PRD §10). No new package without a one-line reason and
  the owner's approval. Prefer built-in features. Before installing, confirm the
  package exists and is maintained; report its exact version and licence
  (permissive licences only, e.g. MIT or Apache 2.0).
- **API facts** (endpoints, parameters, rate limits) come from each API's
  current documentation, never from memory.
- **Secrets** live only in environment variables; `.env.example` lists names
  without values.
- **Interface text** goes in the translation file, never hard-coded in
  components (English first; German later).
- The project owner is learning: explain each technical choice in one or two
  plain sentences.
- After each item: run it, look at it in the browser, run the checks. Keep
  `npm run check` green (typecheck, lint, format, unit tests, build) and the
  Playwright/axe suite green.
- Every edge case in PRD §8 that applies to the work gets a test.
- Commit after each working step, on a feature branch, using Conventional
  Commits (`feat:`, `fix:`, `docs:`, `chore:`, `test:`, `ci:`).
- Update `docs/ROADMAP.md` and any document your change made out of date.

## Placeholder conventions

| Tag | Meaning |
| --- | --- |
| `TODO(content)` | Medical or health wording that a person must supply from the source register, with clinical review |
| `TODO(decision)` | A product or technical decision the project owner has not made yet |

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
