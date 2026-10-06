# AGENTS.md — rules for anyone (human or AI) working on MD Compass

Read this file first. It is the entry point; the detailed documents live in `docs/`.

## What this project is

MD Compass is a website that explains medical conditions to patients and the
public in plain language. See `docs/PRD.md`.

## Source of truth and priority order

If two documents disagree, the higher one wins. Report the conflict to the
project owner; do not silently pick one.

1. **Safety and content rules:** `docs/CONTENT_GUIDELINES.md`
2. **Accessibility rules:** `docs/ACCESSIBILITY.md`
3. **Product requirements:** `docs/PRD.md`
4. **Technical design:** `docs/ARCHITECTURE.md`
5. **Delivery plan:** `docs/ROADMAP.md`
6. **How-to skills:** `.claude/skills/*/SKILL.md`
7. This file's general working rules (below)

## Non-negotiable rules

1. **Never write medical content.** No symptoms, causes, treatments, doses,
   red-flag lists, statistics or advice, not even as an "example". Use a
   placeholder instead:
   `TODO(content): <what is needed> — source + clinical review required`
2. **No personal data.** No accounts, no forms that collect health details, no
   analytics that identify a person. See `docs/ARCHITECTURE.md` → Privacy.
3. **Accessibility is a release blocker**, not a nice-to-have.
4. **Build only the phase you were asked for.** Do not start later phases from
   `docs/ROADMAP.md`.
5. **Ask instead of guessing.** If a requirement is unclear or missing, stop
   and ask the project owner.

## Working rules

- When you change a file, write the whole file (no partial snippets).
- Use the latest stable version of every dependency and report the versions
  installed.
- The project owner is learning: when you make a technical choice, explain it
  in one or two plain sentences.
- Keep the quality gate green before saying work is done: `npm run check`
  (once it exists: typecheck, lint, unit tests, build).
- Commit messages use Conventional Commits (`feat:`, `fix:`, `docs:`,
  `chore:`, `test:`).

## Placeholder conventions

| Tag | Meaning |
| --- | --- |
| `TODO(content)` | Medical or health wording that a sourced, clinically reviewed writer must supply |
| `TODO(decision)` | A product or technical decision the project owner has not made yet |

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
