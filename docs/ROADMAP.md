# Roadmap — MD Compass

Build one phase at a time. Each phase ends with `npm run check` green, the
Playwright/axe suite green, and a short report to the project owner.

## Phase 0: Foundations (no medical content)

Goal: an empty but production-quality shell that every later phase builds on.

- Next.js (App Router) + TypeScript (strict) + Tailwind CSS project
- ESLint (with jsx-a11y) and Prettier configured
- Vitest + Testing Library set up with one passing test
- Playwright + axe-core set up with one passing accessibility test on the home page
- `npm run check` script (typecheck, lint, unit tests, build)
- Site shell in `app/layout.tsx`: `lang` attribute, skip link, header, `<main>`,
  footer, and a slot for the safety notice (wording `TODO(content)`)
- Home page with the project name and `TODO(content)` placeholders only
- `.env.example` (empty or with comments only)
- CI workflow running the check plus the e2e tests `TODO(decision)`: CI provider
  (GitHub Actions assumed)

**Done when:** `npm run dev` shows the shell, `npm run check` passes, and axe
reports zero violations on the home page.

## Phase 1: Content pipeline

- Content schema (Zod) and loader for `content/conditions/*.mdx`
- Build fails on invalid published content
- One **placeholder** condition file (all sections `TODO(content)`, status `draft`)
- Condition page template with all sections from `CONTENT_GUIDELINES.md`
- Region config module

## Phase 2: Browse and search

- A–Z condition index
- On-device search over titles and synonyms
- About and sources page

## Phase 3: First real content

- Content team adds the first reviewed conditions (not written by agents)
- Review-date checks in CI
- Manual accessibility pass

## Phase 4: Launch

- Hosting and domain
- Performance and SEO pass
- Final accessibility audit
