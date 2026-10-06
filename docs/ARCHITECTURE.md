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
| Content | MDX files + front-matter schema (Zod) | Reviewers can read content in plain files; the schema stops pages missing sources or review dates |
| Unit tests | Vitest + Testing Library | Fast tests for components and content validation |
| End-to-end + a11y tests | Playwright + axe-core | Tests real pages in a browser and checks accessibility automatically |
| Lint / format | ESLint (incl. jsx-a11y) + Prettier | Consistent code and catches common accessibility mistakes |
| Hosting | `TODO(decision)` (Vercel suggested) | |

Package versions: always the latest stable at install time; record them in
`package.json` (exact) and mention them in the phase report.

## 3. Folder layout (target)

```
app/                    routes (App Router)
  layout.tsx            site shell: skip link, header, footer, safety notice slot
  page.tsx              home
  conditions/           index + [slug] pages
  about/                how content is sourced and reviewed
components/             UI components
content/conditions/     one MDX file per condition (content team owns)
lib/content/            schema, loaders, validation
lib/config.ts           region config (emergency wording etc.)
tests/                  unit tests
e2e/                    Playwright + axe tests
```

## 4. Content schema (front-matter)

Every condition file must have:

- `title`, `slug`, `summary`
- `synonyms` (list, used by search)
- `sources` — at least one: `{ title, publisher, url, accessed }`
- `reviewedBy`, `reviewedOn`, `nextReviewDue`
- `status` — `draft` | `published`

The build fails if a `published` page is missing any of these. Drafts are never
rendered in production.

## 5. Region configuration

Emergency and service wording lives in one config module (`lib/config.ts`),
never inside content files. `TODO(decision)`: default region behaviour (see
PRD §7).

## 6. Privacy

- No accounts, cookies for tracking, or third-party trackers.
- No forms that collect health information.
- Search runs on the user's device; queries are not sent to a server.
- `TODO(decision)`: whether to add privacy-preserving, cookieless analytics.

## 7. Quality gate

`npm run check` = typecheck + lint + unit tests + build. CI runs it plus the
Playwright/axe suite on every push.
