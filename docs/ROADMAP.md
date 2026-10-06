# Roadmap — MD Compass

Follows `docs/PRD.md` §15. Build one phase at a time; nothing from a later phase
is started early. A phase is finished only when it runs in the browser, its gate
is met, `npm run check` and the Playwright/axe suite are green, and the project
owner has had a short report.

Status key: ✅ done · 🔶 partly done · ⬜ not started

## Phase 0: Foundations 🔶

Goal: an accessible, deployed shell that every later phase builds on.

| Item | Status |
| --- | --- |
| Next.js (App Router), TypeScript strict, Tailwind CSS | ✅ |
| ESLint (with jsx-a11y), Prettier, Vitest + Testing Library, Playwright + axe | ✅ |
| `npm run check` and CI workflow | ✅ |
| Layout: `lang`, skip link, header, `<main>`, footer with disclaimer slot (R27, wording `TODO(content)`) | ✅ |
| Site-wide "Draft content, not yet clinically reviewed" banner (PRD §13) | ⬜ |
| Design tokens for themes, text sizes and spacing; base text 18 px; controls at least 48 × 48 px with 8 px gaps (PRD §12) | ⬜ |
| Translation file for all interface text, English first (PRD §10.1) | ⬜ |
| Main navigation (items appear as their pages are built) | ⬜ |
| Base components (button, link, chip, notice) meeting PRD §12 | ⬜ |
| Settings page (R24, R25): text size, high contrast, reduced motion, larger targets and spacing, 3D on/off, dyslexia-friendly font; stored on the device only (E19, E20) | ⬜ |
| Accessibility scan of every page in both themes (PRD §16.1) | ⬜ |
| Deployed shell on Vercel | ⬜ |

**Gate:** all pages load; accessibility checks pass; settings persist.

## Phase 1: Content system and Daily Living ⬜

- Content loaders with validation (generic loader in `lib/content/files.ts` ✅;
  guide, source register and term list schemas ⬜)
- Guide list with filters by stage and category (R9; E10)
- Guide page: summary, tips, equipment, who to ask, sources, last reviewed
  (R10–R12); "Review due" note after 12 months (E11)
- Sources list
- Production build fails on a guide without a source (E12)

**Gate:** a guide is reachable in three interactions; invalid content fails the build.

## Phase 2: Research hub ⬜

- Supabase database (schema in `ARCHITECTURE.md` §6)
- Source adapters one at a time: ClinicalTrials.gov, PubMed, Europe PMC first,
  then the other registers once their access terms are confirmed (R37, R38)
- Daily job via Vercel Cron (R1, R5, R6; E1–E4, E6, E26)
- List, filters including subtype, keyword search, detail page (R2–R4, R8,
  R28, R39; E5, E7–E9, E23)
- Sources page (R40, R41; E28)

**Gate:** a second run adds no duplicates; a forced failure leaves data intact.

## Phase 3a: Timeline in 2D ⬜

Entry screen with content note (R21; E17), stage controls (R16, R17; E13),
three panels per stage (R14, R29, R30), full text alternative (R20; E18).

**Gate:** completed by keyboard, voice and switch.

## Phase 3b: Timeline in 3D ⬜

Placeholder mannequin, poses, fallbacks and reduced-motion behaviour (R15,
R18, R19, R23; E14–E16).

**Gate:** 2D appears automatically when 3D is off or unavailable.

## Phase 3c: Final model ⬜

The final stylised figure replaces the placeholder.

**Gate:** download size within budget (3D under 3 MB, PRD §10.1).

## Phase 4: Launch readiness and Community ⬜

Home, About (R26) and Community (R33–R35; E24, E25) pages, full manual
accessibility pass, user sessions with at least three people with LGMD,
content review.

**Gate:** the draft banner is removed only after clinical review.

## Phase 5: Later (not scheduled)

AI summaries (R7), German, other muscular dystrophy types, subtype timelines,
bookmarks, alerts, hosted discussion space (R36). See PRD §7.7.
