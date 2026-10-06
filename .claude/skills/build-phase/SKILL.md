---
name: build-phase
description: Build exactly one phase of docs/ROADMAP.md for MD Compass. Use when the user asks to build, start or implement a roadmap phase (e.g. "build Phase 1").
---

# Build a roadmap phase

## 1. Prepare

1. Read `AGENTS.md`, then `docs/PRD.md` (starting with "Read first"), then every
   other file in `docs/`. The PRD wins over everything else.
2. Identify the requested phase in `docs/ROADMAP.md` and PRD §15. Build **only**
   that phase, and only for LGMD.
3. List the PRD requirements (R…) and edge cases (E…) the phase covers.
4. List anything unclear, conflicting, or any `TODO(decision)` that blocks the
   phase. If something blocks you, ask the project owner.

## 2. Plan, then wait

Present, and **wait for the owner's approval** before writing code:
- files to create or change
- npm scripts
- dependencies, each with a one-line reason and licence (stack is fixed by PRD §10)
- questions

## 3. Build (one checklist item at a time)

- Work on a feature branch. Install the latest stable version of each approved
  dependency; record exact versions.
- Write whole files, never partial snippets.
- Never write medical content. Use `TODO(content): ... — source + clinical review required`.
- Interface text goes in the translation file.
- Follow `docs/ACCESSIBILITY.md` for every UI element.
- Check API details against current official documentation, not memory.
- Explain each technical choice in one or two plain sentences.
- After each item: run it, look at it in the browser, run the checks, then commit
  (Conventional Commits).

## 4. Verify

1. `npm run check` passes (typecheck, lint, format, unit tests, build).
2. The Playwright/axe suite passes on every page, in both themes.
3. Each covered edge case (E…) has a passing test.
4. Walk through the phase's gate in `docs/ROADMAP.md` and confirm it.
5. Search the diff for medical wording that is not a `TODO(content)`
   placeholder, and for other muscular dystrophy types named outside "Later".

## 5. Report

Tell the project owner:
- what was built (files) and which requirements/edge cases are covered
- installed package versions and licences
- test results (actual output, including failures)
- every `TODO(content)` added, any open `TODO(decision)` items, anything
  skipped, and the suggested next step
- update the status column in `docs/ROADMAP.md`
