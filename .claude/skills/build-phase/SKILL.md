---
name: build-phase
description: Build exactly one phase of docs/ROADMAP.md for MD Compass. Use when the user asks to build, start or implement a roadmap phase (e.g. "build Phase 0").
---

# Build a roadmap phase

## 1. Prepare

1. Read `AGENTS.md`, then every file in `docs/`.
2. Identify the requested phase in `docs/ROADMAP.md`. Build **only** that phase.
3. List anything unclear or any `TODO(decision)` that blocks the phase. If
   something blocks you, ask the project owner before writing code.

## 2. Plan

Before writing code, state:
- files to create or change
- npm scripts
- dependencies, each with a one-line reason

## 3. Build

- Install the latest stable version of each dependency. Record the exact
  versions.
- Write whole files, never partial snippets.
- Never write medical content. Use `TODO(content): ... — source + clinical review required`.
- Follow `docs/ACCESSIBILITY.md` for every UI element.
- Explain each technical choice in one or two plain sentences.

## 4. Verify

1. `npm run check` passes (typecheck, lint, unit tests, build).
2. The Playwright/axe tests pass (once they exist).
3. Walk through the phase's "Done when" list in `docs/ROADMAP.md` and confirm
   each item.
4. Search the diff for medical wording that is not a `TODO(content)`
   placeholder.

## 5. Report

Tell the project owner:
- what was built (files)
- installed package versions
- test results (actual output, including failures)
- anything skipped, any open `TODO(decision)` items, and suggested next step

Commit with a Conventional Commit message only if the owner asked for a commit.
