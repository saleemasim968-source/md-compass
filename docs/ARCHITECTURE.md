# Architecture — MD Compass

## 1. Shape of the system

A content website with no database and no user accounts. Condition pages are
files in the repository, validated at build time and rendered as static pages.

```
content/conditions/*.mdx  ──validate (schema)──▶  Next.js build  ──▶  static HTML
                                                     │
                                         search index (built at build time)
```

## 2. Stack

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | Next.js (App Router) + React | Builds fast static pages and has good defaults for accessibility and performance |
| Language | TypeScript, `strict` mode | Catches mistakes before the code runs |
| Styling | Tailwind CSS | Consistent spacing, colour and type scales; easy to keep contrast rules |
| Content | MDX files + YAML front-matter (`yaml`) checked by a Zod schema, compiled with `@mdx-js/mdx` | Reviewers can read content in plain files; the schema stops pages missing sources or review dates |
| Unit tests | Vitest + Testing Library | Fast tests for components and content validation |
| End-to-end + a11y tests | Playwright + axe-core | Tests real pages in a browser and checks accessibility automatically |
| Lint / format | ESLint (incl. jsx-a11y) + Prettier | Consistent code and catches common accessibility mistakes |
| Scripts | `tsx` | Runs TypeScript scripts (e.g. the review-date check) with the same content loader as the site |
| Hosting | `TODO(decision)` (Vercel suggested) | |

Package versions: always the latest stable at install time; record them in
`package.json` (exact) and mention them in the phase report.

## 3. Folder layout (target)

```
app/                    routes (App Router)
  layout.tsx            site shell: skip link, header, footer
  page.tsx              home
  conditions/           index + [slug] pages
  about/                how content is sourced and reviewed
components/             UI components
content/conditions/     one MDX file per condition (content team owns)
lib/content/            schema, section list, loader and validation
lib/config.ts           region config (emergency wording etc.)
tests/                  unit tests
e2e/                    Playwright + axe tests
```

## 4. Condition files

One file per condition: `content/conditions/<slug>.mdx`. The file name must
match the `slug`.

### Front-matter (between the `---` lines at the top)

- `title`, `slug`, `summary`
- `synonyms` (list, used by search)
- `sources` — at least one: `{ title, publisher, url (https), accessed }`
- `reviewedBy`, `reviewedOn`, `nextReviewDue` (dates as `YYYY-MM-DD`;
  `nextReviewDue` must be after `reviewedOn`)
- `status` — `draft` | `published`

Drafts may leave sources and review fields empty. Published pages may not.

### Body

The body must contain exactly these `##` headings, in this order (defined in
`lib/content/sections.ts`, from `CONTENT_GUIDELINES.md` §3):

1. What it is
2. Common signs
3. When to get help — must include `<EmergencyHelp />`, which shows the region's
   emergency wording from `lib/config.ts`
4. How it is usually diagnosed
5. How it is usually treated or managed
6. Living with it

The template adds the title, summary, safety notice, Sources and Review
information sections itself. No `#` headings and no `import`/`export` lines are
allowed in content files.

### Validation

`lib/content/loader.ts` checks every file, drafts included. Any problem fails
`next build` with a list of every problem in every file. A `published` page that
still contains `TODO(content)` also fails.

### Drafts

Drafts are shown in `npm run dev` with a "Draft" banner and a `noindex` tag.
They are never built in production, except in the end-to-end test build, which
sets `MDC_INCLUDE_DRAFTS=true`.

## 5. Region configuration

Emergency and service wording lives in one config module (`lib/config.ts`),
never inside content files. The region is chosen at build time with the
`MDC_REGION` environment variable (default: `default`); an unknown region fails
the build. `TODO(decision)`: default region behaviour (see PRD §7).

## 6. Privacy

- No accounts, cookies for tracking, or third-party trackers.
- No forms that collect health information.
- Search runs on the user's device; queries are not sent to a server.
- `TODO(decision)`: whether to add privacy-preserving, cookieless analytics.

## 7. Quality gate

`npm run check` = typecheck + lint + format check + unit tests + build. CI runs
it plus the Playwright/axe suite on every push.

`npm run check:reviews` fails when a published page is past its `nextReviewDue`
date (a page is still in date on its due day; drafts are not checked). It runs
in its own CI workflow (`.github/workflows/review-dates.yml`) on every push and
pull request, and daily on a schedule, because dates pass without any code
changing. It is kept out of `npm run check` so an overdue page does not block
unrelated fixes. `TODO(decision)`: whether to also warn when a review is due
soon, and how many days ahead.
