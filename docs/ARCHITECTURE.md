# Architecture — MD Compass

Implements `docs/PRD.md` §10–§11 and §14. If this file and the PRD disagree,
the PRD wins.

## 1. Shape of the system

Two kinds of data are kept apart on purpose (PRD §11):

| Kind | Where it lives | Why |
| --- | --- | --- |
| Curated content: guides, timeline stages, source register, search-term list, subtype names, community entries | Files in `content/`, validated at build time | Written and reviewed by people; every change is visible in git |
| Research feed: trials and publications | Supabase (Postgres) | Fetched by machine daily; needs search and filters |

```
content/**  ──validate (Zod)──▶  Next.js build ──▶ pages (text renders on the server first)
                                      ▲
Vercel Cron ──▶ /api/cron/ingest ──▶ source adapters ──validate──▶ Supabase ──read-only──┘
```

## 2. Stack (fixed by PRD §10; no changes without the owner's approval)

| Layer | Choice | Why |
| --- | --- | --- |
| Runtime | Node.js (current LTS, see `.nvmrc`) | Required by Next.js; one language for the whole project |
| Framework | Next.js (App Router), React, TypeScript strict | Pages render on the server, so text arrives first |
| Styling | Tailwind CSS with design tokens | Themes and text sizes switch through tokens |
| Database | Supabase (Postgres) | Free tier; built-in text search |
| Curated content | MDX and JSON files, YAML front-matter (`yaml`), compiled with `@mdx-js/mdx` | Every content change is visible and reviewable |
| 3D | React Three Fiber and drei | Standard way to run 3D inside React (Phase 3b only) |
| Validation | Zod | Rejects malformed content and API data before it is used or saved |
| Tests | Vitest, Testing Library, Playwright with axe | Unit, browser and accessibility checks |
| Hosting | Vercel with Vercel Cron | Free tier; daily scheduled update |

Packages are installed at their latest stable version, pinned exactly in
`package.json`, and reported with their licence (PRD §10.1, §14).

## 3. Folder layout (target; folders appear in the phase that needs them)

```
app/
  layout.tsx              shell: skip link, header, nav, draft banner, footer disclaimer   (0)
  page.tsx                home                                                             (0, 4)
  settings/               accessibility settings                                           (0)
  daily-living/           guide list with filters; [slug]/ guide page                      (1)
  research/               list, filters, search; [id]/ detail page                         (2)
  sources/                public source register page                                      (2)
  timeline/               ?stage=1..5; text panels first, 3D layer optional                (3a–3c)
  community/              curated directory                                                (4)
  about/                  what the site is, sourcing, review, error reports                (4)
  api/cron/ingest/        protected daily ingestion endpoint                               (2)
components/               UI components
content/
  guides/*.mdx            Daily Living guides                                              (1)
  sources.json            source register (Appendix C of the PRD, maintained by a person)  (1)
  search-terms.json       reviewed research search terms (R43)                             (2)
  subtypes.json           current subtype names + reviewed mapping of older names (E23)    (2)
  stages/*.mdx            timeline stages                                                  (3a)
  community/*.mdx         community entries                                                (4)
lib/
  content/files.ts        generic content loader (front-matter, Zod, aggregated errors)
  i18n/                   translation files (en first) and lookup helper                    (0)
  settings/               reading and applying device-only settings                        (0)
  research/               record schema, adapters/, ingest run, de-duplication             (2)
  db/                     Supabase clients (public read-only; server-only writer)          (2)
public/models/            3D model files, with their licence recorded                      (3b–3c)
tests/                    unit tests (Vitest)
e2e/                      browser and accessibility tests (Playwright + axe)
```

## 4. Curated content files

All content files are loaded by `lib/content/files.ts`, which each content type
calls with its own Zod schema:

- The file name (lowercase words joined by hyphens) becomes the `slug`.
- Front-matter must be valid YAML and match the type's schema.
- No `import`/`export` lines and no `#` headings in the body.
- Every problem in every file is collected and fails `next build` with a
  plain-language list.
- Drafts are shown in `npm run dev` and in the end-to-end test build
  (`MDC_INCLUDE_DRAFTS=true`), never in production.

Each content item carries `condition: lgmd` and an optional `subtype`. The guide
front-matter follows PRD §9.2 and community entries follow PRD §9.5. Guides
reference sources by id (`sourceIds`) from `content/sources.json`, so a source is
described once. The exact schemas are written in the phase that builds each
type.

## 5. Research ingestion (Phase 2)

- **Trigger:** Vercel Cron calls `/api/cron/ingest` at least once a day (R1).
  The endpoint rejects any request without the `CRON_SECRET` bearer token.
- **Adapters:** one per source, chosen from the source register. Adding a source
  adds an adapter and a register entry; it never changes the database schema.

```ts
interface SourceAdapter {
  /** Matches the source's id in content/sources.json. */
  id: string;
  /** Fetches raw records changed since the last successful run, using the reviewed term list. */
  fetch(options: { since: Date | null; terms: string[]; signal: AbortSignal }): Promise<unknown[]>;
  /** Validates one raw record with Zod and converts it to the common format, or returns null (E3). */
  normalize(raw: unknown): ResearchRecord | null;
}
```

- **Run rules:** each source runs independently. A timeout, error or rate limit
  skips that source and is logged (E1, E2); other sources continue; existing
  data is never deleted (R6). Records are upserted, so a changed trial status
  updates the record instead of duplicating it (E6).
- **De-duplication:** by source and external id (R1). The same item from
  several sources becomes one record with every identifier listed (R39, E4).
  Trials in two registries are merged only where the registries cross-reference
  each other, never on title alone (E26).
- **Subtype:** set only when the record states it, or through the reviewed
  mapping in `content/subtypes.json`; otherwise "Subtype not stated" (R28, E23).
- API endpoints, parameters and rate limits are taken from each API's current
  documentation when the adapter is written (PRD §10.1).

## 6. Database schema (Phase 2, draft)

The common record format is PRD §9.1. Proposed tables:

| Table | Columns |
| --- | --- |
| `research_items` | `id` (uuid), `kind` (`trial` \| `publication`), `condition` (default `lgmd`), `subtype` (nullable), `title`, `abstract` (nullable), `url`, `published_at`, `status` (nullable), `phase` (nullable), `countries` (text[]), `first_seen_at`, `updated_at`, plus a full-text search column over title and abstract (R3) |
| `research_identifiers` | `item_id` → `research_items`, `source`, `external_id`, `url`; unique on (`source`, `external_id`) |
| `ingest_runs` | `id`, `source`, `started_at`, `finished_at`, `outcome` (`ok` \| `failed` \| `rate_limited`), counts fetched / saved / rejected, `error` |

Access (PRD §14): public visitors can only read `research_items`,
`research_identifiers` and the time of the last successful run (R5). Writing uses
a server-only key. `TODO(decision)`: confirm this schema when Phase 2 starts.

## 7. Timeline (Phase 3)

- The stage number in the web address (`/timeline?stage=3`) is the single
  source of truth (R17). Scroll, buttons, chips and arrow keys all change that
  one value (R16). An invalid value shows stage 1 (E13).
- Text panels are always rendered on the server (R20, E18). The 3D scene is an
  optional layer loaded afterwards, only on this page, never focusable, and
  replaced by 2D illustrations when 3D is off, unsupported or slow (R19,
  E14, E15). Total 3D download under 3 MB.

## 8. Settings and interface text (Phase 0)

- Settings (R24) are stored in the browser's local storage only and applied as
  attributes on `<html>` before the page paints, to avoid a flash. With no
  saved value, the operating system's preference applies (R25); once the user
  sets a value, it wins (E20). If storage is blocked, defaults apply for the
  visit without errors (E19).
- All interface text lives in the translation file (`lib/i18n/`), English first,
  so German can be added later without touching components.

## 9. Privacy and security (PRD §14)

- No accounts, no personal or health data, no tracking cookies, no third-party
  scripts or embeds. Any analytics must be cookieless and approved first.
- Search and filters for curated content run on the visitor's device.
- Patient registries are only linked to, never imported.
- Secrets (`CRON_SECRET`, the Supabase server key) live only in environment
  variables, never in code or AI prompts; `.env.example` lists names only.

## 10. Quality gate

`npm run check` = typecheck + lint + format check + unit tests + build. CI runs
it plus the Playwright/axe suite on every push. Each PRD §8 edge case gets a
test; adapters are tested against saved sample responses, including a malformed
one (PRD §16.1).
