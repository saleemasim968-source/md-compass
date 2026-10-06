# MD Compass: Product Requirements Document

An accessible web app for people living with limb-girdle muscular dystrophy (LGMD)

|  |  |
|---|---|
| **Status** | Draft v0.4 (LGMD; multi-source; AI instructions added) |
| **Owner** | Asim |
| **Date** | 6 October 2026 |
| **Working title** | MD Compass (to be confirmed) |
| **Build method** | AI-assisted ("vibe coding") with Claude Code in VS Code, one phase at a time |
| **Project files** | The Markdown files Claude Code generated in the project (for example CLAUDE.md, AGENTS.md and the files in docs/). Where they differ from this document, this document wins. |

**How to read this document.** Sections 1 to 6 say what the product is and who it is for. Sections 7 to 9 are the requirements the AI agent builds from, including edge cases and worked examples. Sections 10 to 14 are the constraints: technology, accessibility, medical content, security. Sections 15 to 17 describe how the build is run and tested. Appendix A shows how the document applies the DataCamp vibe coding guide. Appendix B is the change log. Appendix C is the register of LGMD sources. **AI agents start with the "Read first" section on the next page.**

## Read first: instructions for the AI agent

This section is written for the AI coding agent (Claude Code in the VS Code terminal). It takes priority over every other instruction file in the project.

### The focus is LGMD, not Duchenne

**This product is for people living with limb-girdle muscular dystrophy (LGMD).** An earlier version of the plan was written for Duchenne muscular dystrophy (DMD), and the Markdown files and any code already generated in this project may still describe that version. They are out of date wherever they disagree with this document.

1. **This document is the single source of truth.** If CLAUDE.md, AGENTS.md, any file in docs/, the roadmap, code, tests, content files or seed data conflicts with this document, this document wins. Do not blend the two versions.
2. **Build for LGMD only.** Do not create Duchenne-specific stages, text, search queries, personas, sample data or tests.
3. **Bring the project in line before building anything new.** Search the whole project for the terms in the table below, update every match to the LGMD version, and list each file you changed.
4. **Keep the multi-condition structure.** The condition field stays, with the value lgmd, and a subtype field is added. Other types of muscular dystrophy, including Duchenne, come later. Do not delete the structure that allows this.
5. **Outside this document, Duchenne may appear in two places only:** as a future condition under "Later", and in a change log. Nowhere else in the project.
6. **Do not answer from general muscular dystrophy knowledge.** Duchenne and LGMD differ in age of onset, progression and care. Medical content comes only from the sources in Appendix C, supplied by a person. Where content is missing, insert TODO(content).
7. **If you find a conflict you cannot resolve from this document, stop and ask.** Do not guess and do not pick the older instruction.

### What changes from the Duchenne version

| Item | Old (Duchenne), remove | New (LGMD), use |
|---|---|---|
| Search terms to find in the project | Duchenne, DMD, duchenne, dystrophin, "early ambulatory", "late ambulatory", "non-ambulatory", "baby to adult", "child" | LGMD, limb-girdle muscular dystrophy, lgmd |
| Condition value | duchenne | lgmd, plus an optional subtype field |
| Timeline stages | Five Duchenne care-framework stages, tied to childhood | Five stages of function, not age (section 7.3), to be confirmed by the clinical reviewer |
| 3D figure | A child figure that grows up | A stylised adult mannequin; optional highlight of affected muscle groups |
| Personas | A teenager, the parent of a young child | Adults with LGMD (section 4) |
| Research queries | Duchenne muscular dystrophy | Limb-girdle muscular dystrophy, subtype names and gene names (R43) |
| Research sources | Three APIs only | The source register in Appendix C (R37 to R43) |
| Guide categories | Includes "school and work" | Adds "stairs and steps" and "reaching and lifting"; "work and study" (section 7.2) |
| Content folders and files | Paths and file names containing duchenne | The same structure under lgmd, with the new stage names |
| Community | Not included | A separate Community page, a curated directory (section 7.6) |
| Respectful wording | "people with Duchenne" | "people with LGMD" |

### First prompt to paste into the terminal

Save this document in the project as docs/PRD.md (a Markdown copy is supplied with it, because the agent reads Markdown more reliably than Word). Then paste:

```
Read docs/PRD.md completely, starting with the section
"Read first: instructions for the AI agent".

The project focus has changed from Duchenne (DMD) to limb-girdle
muscular dystrophy (LGMD). docs/PRD.md is the single source of truth.

Step 1. Search every file in this project (Markdown, code, tests,
content, config) for the old terms listed in the PRD table
"What changes from the Duchenne version".
Step 2. Show me a list of every match, grouped by file, with the
change you propose for each. Do not edit anything yet.
Step 3. After I approve, update the files so they all describe the
LGMD version. Write each changed file out in full.
Step 4. Search again and confirm that, outside docs/PRD.md, Duchenne
and DMD now appear only under "Later" and in a change log.
Step 5. Tell me anything in the old files that the PRD does not
cover, so I can decide.

Do not write any medical content yourself. Use TODO(content).
If two instructions conflict, the PRD wins. If the PRD is unclear,
stop and ask me.
```

## 1. Summary

MD Compass is a free web app for people living with limb-girdle muscular dystrophy (LGMD) and the people who support them. It brings three things into one place:

1. **Research:** a plain-language feed of clinical trials and published research, updated automatically every day.
2. **Daily Living:** practical, sourced guides for staying independent in everyday routines.
3. **Timeline:** an interactive 3D view of how LGMD typically affects mobility across stages of function, always paired with what helps at each stage.

The first version covers **LGMD** only. Other types of muscular dystrophy will be added later, and the structure is built to allow that. A separate **Community** page, which points to existing LGMD groups and organisations, follows the three core sections.

## 2. Problem

- Information about LGMD is scattered across registries, journals, charity sites and forums, and much of it is written for clinicians.
- LGMD is a group of more than 30 subtypes, each linked to a different gene. Information is usually organised by gene name, which is hard to navigate for someone newly diagnosed.
- Much general muscular dystrophy material is written about childhood-onset types. LGMD can begin in childhood, adolescence or adulthood, so that material often does not fit.
- Research moves quickly, with clinical trials under way for several subtypes, and people have no simple way to see what is current for their own subtype.
- Practical independence advice exists but is hard to find by "where I am right now" rather than by age.
- Most explanations of progression are text or static diagrams, which makes it hard to picture what changes and when.
- Many health websites are hard to use with limited hand and arm strength, which is the situation of this audience.

## 3. Goals and non-goals

### 3.1 Goals

| ID | Goal |
|---|---|
| G1 | Make current research findable and understandable in under two minutes. |
| G2 | Help a person find a guide relevant to their current mobility stage in three interactions or fewer. |
| G3 | Explain progression visually, honestly and without causing avoidable distress. |
| G4 | Be fully usable with keyboard only, switch access, voice control and one hand. |
| G5 | Make every medical statement traceable to a named source. |

### 3.2 Non-goals for the first version

- Not a diagnostic tool, symptom checker or source of individual medical advice.
- Not a chatbot.
- No user accounts and no collection of personal health data.
- No own forum or user-to-user messaging in the first version. Instead, a separate Community page links to existing LGMD communities (section 7.6).
- No other muscular dystrophy types yet. The current focus is LGMD; other types are added later (section 7.7).
- No native mobile apps (responsive website only).

## 4. Target users

| Persona | Who | Needs | Constraints |
|---|---|---|---|
| **Sam, 24**, diagnosed with LGMD two years ago | Walks independently; stairs and getting up from low seats are hard; uses phone and laptop | Practical tips for home and work, honest information about what may lie ahead | Lifting the arms is tiring; fatigue builds through the day |
| **Layla, 38**, newly diagnosed after a genetic test | Overwhelmed by gene names and subtype labels, searching late at night | To understand her subtype in plain language and what she can do now | Emotionally vulnerable; new to the medical terms |
| **Jonas, 47**, has lived with LGMD for 20 years | Uses a power wheelchair, voice control and a switch; follows research closely | Trial updates for his subtype, status, locations | Limited shoulder and arm strength; cannot use drag gestures or small targets |
| **Mira**, physiotherapist | Supports several people with neuromuscular conditions | Something trustworthy to point people to | Needs sources to be visible |

Sam and Jonas are the primary personas. If a feature does not work for them, it is not finished.

## 5. Scope decision: LGMD first

"Muscular dystrophy" covers many genetic conditions. This version focuses on one group: limb-girdle muscular dystrophy. LGMD is itself a group of more than 30 subtypes (sources give different counts). Each subtype is linked to a different gene and is named as recessive (LGMD R) or dominant (LGMD D). What the subtypes share is the pattern: weakness typically begins in the muscles around the hips, thighs and shoulders.

Onset can be in childhood, adolescence or adulthood, and the speed of progression differs widely between subtypes and between people. That has four consequences for the product:

- **Stages by function, not by age.** The timeline is organised around what a person can do (for example walking with or without aids), because age does not predict where someone is.
- **Subtype is a first-class field.** Every research record and content item carries the condition (LGMD) and, where known, the subtype, so people can filter to what applies to them.
- **General first, subtype where sourced.** The first version describes the general LGMD pattern. Subtype-specific statements appear only where a source supports them and always name the subtype.
- **Stages need clinical confirmation.** LGMD has no single, widely used staged care framework that the timeline can copy, so the stages in section 7.3 are a proposal to be confirmed with the clinical reviewer.

Other types of muscular dystrophy are added later. The condition field makes that possible without restructuring.

The background in this section is corroborated across several independent sources, listed with their points of agreement and disagreement in Appendix C.2. All medical statements in this document are orientation for the build and are subject to the review in section 13.

## 6. User journeys

| Persona | Journey |
|---|---|
| Sam | Opens the site on his phone, taps Daily Living, taps the chip for his stage, taps "Stairs and steps", reads a three-minute guide. Three taps from the home page. |
| Layla | Opens Timeline, reads the content note, chooses to continue, moves through the stages with the Next button, and at each stage sees what helps. Then opens Community and finds a patient organisation and a registry for her country. |
| Jonas | Says "Click Research", then "Click Recruiting", then "Click Germany", then picks his subtype. Opens a trial and follows the link to the original record. |
| Mira | Opens a guide, checks the sources and the review date at the bottom, prints it for a client. |

## 7. Features and requirements

Priority: P0 is required for the first version, P1 follows soon after, P2 is later. Requirement numbers R1 to R27 match the companion files. R28 to R36 were added in v0.3 and R37 to R43 in v0.4.

### 7.1 Research hub (P0)

Shows recent clinical trials and publications for LGMD. Data comes from the source register in Appendix C, not from a single source. Automatic collection starts with three official, free APIs (ClinicalTrials.gov API v2, PubMed E-utilities and Europe PMC) and is extended to the other registries and catalogues in the register as the access terms of each are confirmed. Web pages are not scraped, because scraping is fragile and often against a site's terms of use.

| ID | Requirement | Priority |
|---|---|---|
| R1 | Scheduled ingestion at least once a day; duplicates removed by source and external ID. | P0 |
| R2 | List view with filters: type (trial or publication), trial status, phase, country, date. | P0 |
| R3 | Keyword search over title and abstract. | P0 |
| R4 | Detail view shows title, date, source, status, and a prominent link to the original record. | P0 |
| R5 | Each page shows the time of the last successful update. | P0 |
| R6 | If an update fails, the site keeps showing the last good data and logs the failure. | P0 |
| R7 | Plain-language summary per item, generated only from that item's abstract and labelled "AI-generated summary. Check the original source." | P1 |
| R8 | Nothing is presented as a recommendation. Trial pages carry the line "Talk to your care team before considering any trial." | P0 |
| R28 | Filter by LGMD subtype where the record states it. Records that name no subtype appear under "Subtype not stated". A subtype is never guessed. | P0 |
| R37 | Coverage comes from the source register (Appendix C). Every source in it that offers a public API or a permitted download is collected automatically. No section of the site depends on one source alone. | P0 |
| R38 | Trials are covered beyond ClinicalTrials.gov: the WHO registry platform (which gathers 20 national and regional registries, including the EU and German registers) and the EU trials portal. Where a registry has no API or permitted download, the site links to that registry's own search for LGMD. | P0 |
| R39 | The same trial or paper found in several sources is shown once, with every source and identifier listed (registry number, DOI, PubMed ID). | P0 |
| R40 | A public Sources page lists every source, what it is used for, and when it was last checked. | P0 |
| R41 | The register is reviewed every three months by a person. A "Suggest a source" email link is on the Sources page. New sources are added by a person, never by the AI. | P0 |
| R42 | General medical statements in curated content are supported by at least two independent sources where two exist. Where sources disagree, the site shows the range and names both. | P0 |
| R43 | Searches use a reviewed term list: the condition name, current and older subtype names, gene names and disease names (for example LGMD R1, LGMD2A, calpainopathy, CAPN3). The list is a content file, maintained by a person. | P0 |

### 7.2 Daily Living guides (P0)

Practical guides for everyday independence. Categories: getting up and transfers, stairs and steps, reaching and lifting, dressing, eating and drinking, washing and toileting, home adaptations, work and study, assistive technology, getting out and travel, energy management.

| ID | Requirement | Priority |
|---|---|---|
| R9 | Guides can be filtered by mobility stage (not age) and by category. | P0 |
| R10 | Each guide has a summary, step-by-step tips, equipment that may help, who to ask, sources, and a last-reviewed date. | P0 |
| R11 | Content is original writing that links to reputable sources. No copied text. | P0 |
| R12 | Each guide can be read in under three minutes and printed. | P0 |
| R13 | At least 12 guides at launch, at least one per category. | P0 |

### 7.3 Timeline (P0, delivered in three steps)

Shows five stages of function in LGMD and how mobility typically changes, using a stylised figure that moves between stages. Stages are defined by function, not age.

**Proposed stages, to be confirmed with the clinical reviewer:** (1) first signs, (2) walking independently, with difficulty on stairs and when rising from a seat, (3) walking with aids, (4) using a wheelchair for part of the day, (5) using a wheelchair full time. Published functional scales for LGMD, such as the North Star Assessment for limb-girdle type muscular dystrophies, are a possible basis for the final wording. Not everyone reaches every stage, and some subtypes progress slowly.

| ID | Requirement | Priority |
|---|---|---|
| R14 | Each stage shows three panels: what typically changes, what helps at this stage, related guides. | P0 |
| R15 | The figure is a stylised, abstract adult mannequin, not a realistic patient. | P0 |
| R16 | Stage changes work by scrolling and also by Previous and Next buttons, numbered stage chips and arrow keys. Scrolling is never the only way. | P0 |
| R17 | The current stage is in the web address (for example /timeline?stage=3) so it can be shared. | P0 |
| R18 | With reduced motion switched on, transitions become cross-fades between still poses. | P0 |
| R19 | If 3D is unavailable or the device is slow, the page falls back to 2D illustrations with identical text. | P0 |
| R20 | A full text alternative of the whole timeline is on the same page. | P0 |
| R21 | An entry screen with a short content note and a clear choice to continue or go elsewhere. | P0 |
| R22 | Age is not used to define stages. Age of onset appears only as sourced context that varies by subtype. No life-expectancy figures. | P0 |
| R23 | Delivery order: accessible 2D version, then 3D with a placeholder mannequin, then the final 3D model. | P0 |
| R29 | Each stage states that paths differ: not everyone reaches every stage, and speed varies by subtype and person. | P0 |
| R30 | A sourced note, visible at every stage, that some subtypes can involve the heart or breathing and that regular checks are a topic for the care team. Wording comes from sources, not from the AI. | P0 |
| R31 | The figure can highlight the muscle groups typically affected (around the hips, thighs and shoulders first). The highlight is a labelled on/off control with a text equivalent. | P1 |
| R32 | A short "About LGMD subtypes" explainer: what the R and D names mean and where to find one's own subtype, with sources. Subtype-specific timeline notes appear only where sourced. | P1 |

### 7.4 Accessibility settings (P0)

| ID | Requirement | Priority |
|---|---|---|
| R24 | Settings saved on the device only: text size, high contrast, reduced motion, larger targets and spacing, 3D on or off, dyslexia-friendly font. | P0 |
| R25 | Settings follow the operating system's preferences by default. | P0 |

### 7.5 About, sources and disclaimer (P0)

| ID | Requirement | Priority |
|---|---|---|
| R26 | A plain statement of what the site is and is not, who made it, how content is sourced and reviewed, and how to report an error. | P0 |
| R27 | Medical disclaimer in the footer of every page. | P0 |

### 7.6 Community page (P1)

A separate page that helps people find others living with LGMD. In this version it is a curated directory that links out to communities, patient organisations and registries that already exist. It does not host conversations itself.

**Why a directory first.** A forum of our own would need user accounts, moderation and the handling of personal health information. That conflicts with the first version's rule of collecting no personal data, and it carries real safeguarding and misinformation risks in a health setting. A directory gives people a route to community now, at low risk. A hosted discussion space stays possible later (R36).

| ID | Requirement | Priority |
|---|---|---|
| R33 | A Community page, reachable from the main navigation, listing LGMD communities, patient organisations and patient registries. Each entry shows name, what it offers, language, country and a link. Filter by country and language. | P1 |
| R34 | Entries are curated content files with a "last checked" date. Listing criteria are published on the page. No entry is added by the AI. | P1 |
| R35 | External links are clearly marked as leaving the site. No embedded third-party widgets, feeds or trackers. "Suggest a group" is an email link, not a form that stores data. | P1 |
| R36 | A hosted discussion space is considered only after: accounts with consent, named moderators and a moderation policy, a data-protection assessment for health information, and safeguarding rules. It is not built without expert review. | P2 |

### 7.7 Later (P2)

- German language version (the interface is built translation-ready from the start).
- Other types of muscular dystrophy, each with its own timeline.
- Subtype-specific timelines for the most common LGMD subtypes.
- Bookmarks and "new since my last visit", stored on the device.
- Trial alerts by email.

## 8. Edge cases

AI-generated code tends to handle only the ideal case. Each edge case below is a requirement and needs a test.

| ID | Area | Situation | Expected behaviour |
|---|---|---|---|
| E1 | Research | A source API is down or times out | That source is skipped and logged; other sources continue; existing data stays |
| E2 | Research | API rate limit is reached | Stop politely, record the run as failed, retry at the next scheduled run |
| E3 | Research | Response has an unexpected shape | Validation rejects the item; it is logged, not saved |
| E4 | Research | Same paper arrives from PubMed and Europe PMC | Stored once, matched by PubMed ID |
| E5 | Research | Item has no abstract | Shown with title and link; no summary; no empty box |
| E6 | Research | A trial's status changes after it was saved | The record is updated, not duplicated |
| E7 | Research | Filters or search return nothing | Plain message and a one-tap "Clear filters" button |
| E8 | Research | Database is empty or cannot be reached | Plain message; rest of the site works |
| E9 | Research | Data is older than 48 hours | A visible "last updated" note with the date |
| E10 | Guides | No guide exists for a stage and category | Message plus a link to all guides for that stage |
| E11 | Guides | A guide's review is more than 12 months old | "Review due" note shown on the guide |
| E12 | Guides | A guide has no source | Production build fails with a clear message |
| E13 | Timeline | Web address has an invalid stage (for example stage=9 or stage=abc) | Stage 1 is shown; no error |
| E14 | Timeline | 3D is not supported or the model fails to load | 2D illustrations appear automatically; text unaffected |
| E15 | Timeline | Device is slow | Switch to 2D and say so in one line |
| E16 | Timeline | Reduced motion is on | No scroll-linked animation; cross-fades only |
| E17 | Timeline | Visitor declines the content note | Returned to the home page; choice is not stored as a block |
| E18 | Timeline | JavaScript is unavailable | All five stages readable as text |
| E19 | Settings | Device storage is blocked (private browsing) | Defaults apply; settings work for the visit; no crash |
| E20 | Settings | Operating-system preference and in-app setting differ | The in-app setting wins once the user has set it |
| E21 | All pages | 320 px width or 200% zoom | No content cut off; no sideways scrolling |
| E22 | All pages | Slow or lost connection | Text loads first; 3D and images never block reading |
| E23 | Research | Record names no subtype, or uses an older subtype name | Older names are mapped to current names only through a reviewed mapping table; otherwise "Subtype not stated" |
| E24 | Community | A listed link no longer works | A monthly link check flags the entry; it is hidden until a person fixes it |
| E25 | Community | No entries for the selected country | International entries are shown with a one-line explanation |
| E26 | Research | The same trial is registered in two registries under different numbers | Merged into one record where the registries cross-reference each other; both numbers shown; never merged on title alone |
| E27 | Content | Two sources disagree on a fact (for example how common LGMD is) | The range is shown and both sources are named; no single figure is picked |
| E28 | Sources | A source in the register has not been checked for more than three months | Flagged on the Sources page and in the build report |

## 9. Worked examples

These examples show the AI agent the exact shape of the data. All values are fictional placeholders. They are not real studies, sources or medical statements.

### 9.1 A research item after ingestion

Input: one study record from the ClinicalTrials.gov API. Output: one row in the research table.

```
{
  "source": "clinicaltrials",
  "external_id": "NCT00000000",
  "kind": "trial",
  "condition": "lgmd",
  "subtype": null,
  "title": "Placeholder title (not a real study)",
  "abstract": "Placeholder summary text from the record.",
  "url": "https://clinicaltrials.gov/study/NCT00000000",
  "published_at": "2026-01-15",
  "status": "RECRUITING",
  "phase": "PHASE2",
  "countries": ["Germany", "United Kingdom"]
}
```

### 9.2 A guide file header

```
title: Placeholder guide title
summary: TODO(content): needs sourced text
category: dressing
stages: [3, 4]
whoToAsk: ["Occupational therapist"]
sourceIds: ["src-placeholder-01"]
lastReviewed: null
reviewedBy: null
```

### 9.3 Timeline behaviour

| Input | Output |
|---|---|
| Visitor opens /timeline?stage=3 | Stage 3 panels shown; screen reader hears "Stage 3 of 5" and the stage name |
| Visitor presses the right arrow key on the stage control | Address becomes ?stage=4; figure changes pose; panels update |
| Visitor opens /timeline?stage=9 | Stage 1 is shown |
| Reduced motion is on and visitor taps Next | Still pose cross-fades to the next still pose in 200 ms or less |

### 9.4 Filter behaviour

| Input | Output |
|---|---|
| Research: type = trial, status = recruiting, country = Germany | Only recruiting trials with Germany listed; address holds the filter state so it can be shared |
| Daily Living: stage = 4, category = dressing, no matching guide | Message "No guides here yet" and a link to all stage 4 guides |

### 9.5 A community entry

```
name: Placeholder organisation (not a real entry)
kind: patient-organisation
offers: TODO(content): one line, written by a person
countries: ["DE"]
languages: ["de", "en"]
url: https://example.org
lastChecked: 2026-10-06
```

## 10. Technology and constraints

The AI agent must use exactly this stack and must not swap or add tools without approval.

| Layer | Choice | Why |
|---|---|---|
| Runtime | Node.js (current LTS) | Required by Next.js; one language for the whole project |
| Framework | Next.js (App Router), React, TypeScript in strict mode | Pages render on the server, so text arrives first |
| Styling | Tailwind CSS with design tokens | Themes and text sizes can switch through tokens |
| Database | Supabase (Postgres) | Free tier; built-in text search |
| Curated content | MDX and JSON files in the project | Every content change is visible and reviewable |
| 3D | React Three Fiber and drei | Standard way to run 3D inside React |
| Validation | Zod | Rejects malformed API data before it is saved |
| Tests | Vitest, Testing Library, Playwright with axe | Unit, browser and accessibility checks |
| Hosting | Vercel with Vercel Cron | Free tier; daily scheduled update |

### 10.1 Constraints

- **Versions:** latest stable release of each package at the time of setup; the agent reports the versions it installed.
- **Dependencies:** no new package without a one-line reason and approval. Prefer built-in features over a new library.
- **Real packages only:** before installing anything, the agent confirms the package exists and is maintained. AI tools sometimes suggest packages or API parameters that do not exist.
- **API facts:** endpoints, parameters and rate limits are checked against each API's current documentation before coding, not taken from memory.
- **Performance:** main content visible within 2.5 seconds on a mid-range phone; 3D files load only on the timeline page; total 3D download under 3 MB.
- **Cost:** runs on free tiers.
- **Devices:** phone, tablet and desktop; works at 320 px width and 200% zoom.
- **Language:** all interface text in a translation file; English first.

## 11. Architecture in brief

Two kinds of data are kept apart on purpose.

| Kind | Where it lives | Why |
|---|---|---|
| Curated content (stages, guides, sources, community entries) | Files in the content folder | Written and reviewed by people; changes are tracked |
| Research feed (trials, papers) | Supabase database | Fetched by machine, changes daily, needs search and filters |

**Daily update flow:** a scheduled job calls a protected address on the site. For each source it fetches new records, checks their shape, converts them to the common format in section 9.1, and saves them. A run log records what happened. A failure in one source never deletes data or stops the others.

**Timeline:** the stage number in the web address is the single source of truth. Scroll, buttons, chips and keys all change that one value. The text panels are always present; the 3D scene is an optional layer loaded afterwards.

**Sources:** the list of sources is data, not code. Each source has an entry in the register (name, kind, access method, licence, last checked) and, where it is collected automatically, its own adapter. Adding a source does not change the database structure.

**Condition and subtype:** research records and content items carry a condition field (set to LGMD) and an optional subtype field. Subtype names follow the current R and D naming, with a reviewed mapping table for older names.

Folder structure, the full database schema and the adapter interface are in ARCHITECTURE.md.

## 12. Accessibility requirements

Baseline is WCAG 2.2 level AA. The rules below go beyond it because of who the product is for. LGMD typically weakens the shoulders and upper arms, so reaching, holding a phone up and lifting an arm to the top of a screen can be tiring even when the hands work well. Full detail and the test checklist are in ACCESSIBILITY.md.

| Area | Requirement |
|---|---|
| Target size | Every control at least 48 by 48 pixels with 8 pixels between controls; 64 pixels with the "larger targets" setting |
| Reach | Primary actions sit in the lower half of phone screens; nothing essential is only at the top of the screen; stage controls stay within reach without scrolling |
| Gestures | No dragging, swiping, pinching, long-press, double-click or hover as the only way to do something |
| Scrolling | Anything driven by scrolling also works with buttons and keys |
| Time | No timeouts, no auto-advancing content, no messages that disappear by themselves |
| Keyboard | Everything works by keyboard; visible focus ring; skip link; no traps; the 3D canvas never takes focus |
| Voice control | Every control has visible text and can be activated by saying it; no icon-only buttons |
| Switch access | Few focus stops; related controls grouped |
| Motion | Reduced-motion preference honoured; no flashing; nothing moves for more than five seconds without a pause control |
| 3D | Full text equivalent; stage changes announced to screen readers; 3D can be switched off |
| Reading | Contrast at least 4.5 to 1; base text 18 pixels, scalable to 200%; colour never the only signal |
| Language | Plain language at a reading age of about 12 to 14; medical terms explained where they appear |

## 13. Medical content and safety

**This is a medical information product, so expert review is mandatory.** AI-assisted coding is suitable for building the site. It is not suitable for writing or checking the medical content.

- Every medical statement links to a named source and carries a review date.
- Sources come from the register in Appendix C: guidelines and care recommendations, peer-reviewed research, reference databases, health agencies and established patient organisations. Forums, social media, product pages and AI output are not sources.
- No medical statement rests on a single source where a second independent source exists. Disagreements between sources are shown, not hidden.
- Each source is used with its date. Retired or superseded documents are marked as historical and are not used for current statements.
- The AI agent never writes medical facts, ages, statistics or sources. Where content is missing it inserts the marker TODO(content) and lists it in its report.
- Wording uses "typically" and "varies from person to person". No predictions about an individual.
- General statements about LGMD are labelled as general. Statements about one subtype name that subtype and cite a source for it.
- Every "what changes" is paired with "what helps".
- No treatment recommendations, dosing, exercise prescriptions, brand names or cure claims.
- Respectful language: "people with LGMD", "uses a wheelchair". Never "sufferers" or "wheelchair-bound".
- A neuromuscular clinician or an LGMD patient organisation reviews all content, including the timeline stages, before public launch. Until then every page shows "Draft content, not yet clinically reviewed".
- An error-report link is on the About page; corrections are dated.

Tone, the guide template and the review workflow are in CONTENT_GUIDELINES.md.

## 14. Security, privacy and licensing

| Topic | Rule |
|---|---|
| API keys | Kept only in environment variables (.env files), never in code and never pasted into an AI chat. The .env files are excluded from version control; a .env.example lists the names without values. |
| Database access | Public visitors can only read. Writing uses a server-only key. The scheduled update address rejects requests without its secret. |
| Personal data | None collected. No accounts, no health data, no tracking cookies. Preferences stay on the visitor's device. GDPR applies. |
| Data shared with AI tools | Only project code and public information. No personal or confidential data in prompts. |
| Third-party scripts | None by default. Any analytics must be cookieless and approved first. |
| Code licences | Only permissively licensed packages (for example MIT or Apache 2.0). The agent reports the licence of each new dependency. |
| 3D model and images | Self-made, commissioned, or under a licence that allows this use. The licence is recorded in the project. |
| Source text | Summarised in original words with a link. No copied passages. |
| Code review | AI output is treated like a contribution from a stranger: read it, run it, test it before accepting it. |

## 15. Build plan

The build follows a loop: describe one small goal, let the AI draft it, run it, test it, refine. **A phase is not finished until it runs in the browser and passes its checks.** Nothing from a later phase is started early.

| Phase | Goal | Main deliverables | Gate before moving on |
|---|---|---|---|
| 0 | Foundations | Project scaffold, checks wired up, layout, base components, settings page, deployed shell | All pages load; accessibility checks pass; settings persist |
| 1 | Content system and Daily Living | Content loaders with validation, guide list with filters, guide page, sources list | A guide is reachable in three interactions; invalid content fails the build |
| 2 | Research hub | Database, source adapters one at a time (the three core APIs first, then the other registers), daily job, list, filters including subtype, search, detail page, Sources page | Second run adds no duplicates; forced failure leaves data intact |
| 3a | Timeline in 2D | Entry screen, stage controls, panels, text alternative | Completed by keyboard, voice and switch |
| 3b | Timeline in 3D | Placeholder mannequin, poses, fallbacks, reduced-motion behaviour | 2D appears automatically when 3D is off or unavailable |
| 3c | Final model | Final stylised figure replaces the placeholder | Download size within budget |
| 4 | Launch readiness and Community | Home, About and Community pages, full manual accessibility pass, user sessions, content review | Draft banner removed only after review |
| 5 | Later | AI summaries, German, other muscular dystrophy types, subtype timelines, bookmarks, alerts, hosted discussion space | Not scheduled |

### 15.1 Working rules for each session

1. Start a fresh AI session for each phase so the context stays small and consistent.
2. The agent reads AGENTS.md and the relevant companion files first.
3. The agent proposes a plan (files, dependencies, questions) and waits for approval.
4. One checklist item at a time. Each changed file is written out in full.
5. The agent explains each technical choice in one or two plain sentences.
6. After each item: run it, look at it in the browser, run the checks.
7. Commit after each working step, so any change can be undone.
8. The agent updates the roadmap and any document its change made outdated.

## 16. Testing and debugging

### 16.1 What is tested

| Kind | What it covers |
|---|---|
| Automated checks on every change | Code style, type checking, unit tests, browser tests, accessibility scan of every page in both themes |
| Edge cases | Each item E1 to E28 in section 8 has a test |
| Data adapters | Tested against saved sample responses, including a malformed one |
| Manual check at the end of each phase | Keyboard only, screen reader, voice control, switch control, 200% zoom, 320 px width, reduced motion, one thumb on a phone, slowed-down device |
| With real users before launch | At least three people with LGMD using their own setup |

### 16.2 When something breaks

1. Copy the exact error message and paste it back to the agent.
2. Ask for a plain-language explanation of the cause before any fix.
3. Treat the fix as a hypothesis: apply it, run the checks, confirm the original problem is gone and nothing else broke.
4. If two attempts fail, go back to the last working commit and try a smaller step.
5. Code that runs is not proof that it is right. Compare the output with the expected behaviour in sections 8 and 9.

## 17. Success measures

- Every page passes the automated accessibility scan, and a manual keyboard-only and voice-control pass.
- Research data is never more than 48 hours old.
- Every medical statement has a source, and general statements have at least two where two exist.
- Every source in the register has been checked within the last three months.
- In user sessions, each participant finds a relevant guide and moves through the timeline without help.
- Participants describe the timeline as clear and honest, not frightening.

## 18. Risks

| Risk | Mitigation |
|---|---|
| Medical inaccuracy | Source for every claim, expert review before launch, draft banner, error-report link |
| A relevant source is missed | Aggregating registries and catalogues, quarterly review of the register, "Suggest a source" link |
| The AI mixes the Duchenne and LGMD versions | "Read first" section, single source of truth, project-wide search and update before building |
| General content misleads because subtypes differ | General and subtype statements labelled separately; subtype filter; stages confirmed by reviewer |
| Community links lead to unreliable groups | Published listing criteria, curated entries, last-checked date, monthly link check |
| Timeline is distressing | Opt-in entry, stylised figure, "what helps" pairing, no life-expectancy figures, user sessions |
| 3D excludes the people it is for | Buttons and keys equal to scroll; 2D and text alternatives; reduced motion |
| No suitable 3D model | Placeholder built from simple shapes first; final model is swappable |
| AI writes plausible but wrong code | Small steps, checks after each, edge-case tests, review before accepting |
| AI invents packages or API details | Verify against official documentation before use |
| Project grows beyond what the AI can keep in view | Clear folder structure, companion files, fresh session per phase |
| AI summaries misstate research | P1 only, abstract-only, labelled, linked to the original, can be switched off |
| An API changes or goes down | One adapter per source, run log, last good data kept |
| Scope creep | Phased plan with a gate for each phase |

## 19. Open questions

1. Final product name.
2. Who performs the clinical review: a neuromuscular clinician, or an LGMD patient organisation?
3. Are the five proposed stages in section 7.3 right, and which published scale should their wording follow?
4. Which subtypes appear in the filter at launch: all named subtypes, or the most common ones first?
5. What are the listing criteria for the Community page, and who checks entries?
6. What are the access terms of the WHO registry platform, the EU trials portal, OpenAlex and Orphadata? Each is confirmed before its adapter is built.
7. Who produces the final 3D figure: self-made, commissioned, or a licensed base model?
8. Is this a portfolio project or intended for real public use? This decides how strict the review gate must be before launch.
9. Is German needed at launch or later?

## Appendix A: How this document applies the DataCamp guide

Source: "A Complete Vibe Coding Guide for Beginners", DataCamp, 5 March 2026. The guide does not contain a PRD template. It sets out a workflow, prompting habits, common mistakes and risks. This table shows where each piece of advice is built into this document.

| Advice in the guide | Where it is applied |
|---|---|
| Describe the goal clearly: what the code should do, the environment, the assumptions | Sections 1 to 6 |
| Be specific about languages and frameworks | Section 10 |
| Give constraints: performance, libraries, versions | Section 10.1 |
| Supply example inputs and outputs | Section 9 |
| Ask for explanations of how the code works | Section 15.1, rule 5 |
| Break large tasks into smaller steps | Section 15, phases and gates |
| Do not move on until the code runs | Section 15, gate per phase |
| Paste the exact error back and ask for the cause first; treat fixes as hypotheses | Section 16.2 |
| Do not trust output without review | Section 14, code review; section 15.1 |
| Do not overbuild too fast | Section 15: one phase at a time; non-goals in section 3.2 |
| Prompt explicitly for edge cases | Section 8 |
| Understand and limit dependencies | Section 10.1 |
| Keep the project structured as it grows | Section 11; companion files; fresh session per phase |
| Sensitive systems such as a medical database need expert review | Section 13 |
| Keep API keys in .env files, never in prompts | Section 14 |
| Check licences of generated code | Section 14 |
| Watch for invented libraries and APIs | Section 10.1; section 18 |
| Do not paste private data into AI tools | Section 14 |

## Appendix B: Change log

| Version | Request | What changed |
|---|---|---|
| v0.3 | Community: "Maybe have a separate page for this feature" | Section 7.6: a separate Community page (R33 to R36), a curated directory first, with a hosted discussion space kept for later. |
| v0.3 | "Current focus is on limb-girdle muscular dystrophy"; other types later | Whole document refocused on LGMD: personas, scope, subtype filter (R28), guide categories, timeline stages by function (R29 to R32). Other types, including Duchenne, moved to section 7.7. |
| v0.4 | Use every publicly available source on LGMD, not one | Appendix C: source register with seven groups of sources and a table of what they agree on. New requirements R37 to R43, edge cases E26 to E28, a Sources page, and a two-source rule in section 13. |
| v0.4 | Tell the AI that the focus is LGMD, not DMD | New "Read first" section: single source of truth, old-to-new table, and a first prompt for the terminal. The list of companion files was removed, because the project's Markdown files are generated by Claude Code. |

## Appendix C: LGMD source register

This register is the starting list of publicly available sources on LGMD. It was compiled on 6 October 2026. **No list can be guaranteed complete.** Coverage is kept as wide as possible in three ways: by using sources that themselves gather many others (the WHO registry platform, PubMed, Europe PMC, OpenAlex, Orphanet), by reviewing the register every three months, and by inviting suggestions (R41).

"Automatic" means collected by the daily job through an API or permitted download. "Curated" means a person reads the source and writes sourced content from it. "Link" means the site points to it. Access terms and licences are confirmed for each source before it is used (section 14).

### C.1 Sources by group

| Source | What it provides | Use in the product |
|---|---|---|
| **Group 1: Clinical trial registries** |  |  |
| ClinicalTrials.gov (API v2) | Trials worldwide, status, phase, locations | Automatic |
| WHO International Clinical Trials Registry Platform (who.int) | Gathers 20 registries, among them ClinicalTrials.gov, the EU registers, the German register (DRKS), ISRCTN and registries in Asia, Africa, Australia and Latin America | Automatic if terms allow, otherwise link |
| EU Clinical Trials Information System (euclinicaltrials.eu) | Trials in the EU and EEA; public search site | Link; no public API is described by the EMA |
| EU Clinical Trials Register (older trials), DRKS, ISRCTN | Regional registers | Through the WHO platform; link |
| **Group 2: Research literature** |  |  |
| PubMed (E-utilities) | Published biomedical papers and abstracts | Automatic |
| Europe PMC (REST API) | Papers, open-access full text and preprints | Automatic |
| OpenAlex (developers.openalex.org) | Open catalogue of scholarly works, open-access links | Automatic, to fill gaps and find free versions |
| Crossref | DOI records for de-duplication | Automatic, supporting role |
| **Group 3: Guidelines and care recommendations** |  |  |
| American Academy of Neurology and AANEM: evidence-based guideline summary on diagnosis and treatment of limb-girdle and distal dystrophies (2014) | The main published guideline covering LGMD as a group | Curated |
| 229th ENMC workshop: LGMD nomenclature and reformed classification (Neuromuscular Disorders, 2018) | Current definition of LGMD and the R and D naming | Curated; basis of the subtype name table |
| French National Protocol for calpainopathy, LGMD R1 and D4 (Orphanet Journal of Rare Diseases, 2026) | Consensus care guidance for one subtype | Curated, subtype-specific |
| Diagnosis and care recommendations for LGMD R9 (draft presented at the MDA conference, March 2025) | Draft care guidance for one subtype | Curated once published; marked as draft until then |
| AFM-Telethon, yearly "Advances in limb-girdle muscular dystrophies" | Yearly research summary | Curated |
| **Group 4: Reference databases** |  |  |
| Orphanet and Orphadata (orpha.net, orphadata.com) | Disease definitions, classification codes, prevalence; data under CC BY 4.0 with attribution | Curated; codes may be collected automatically |
| MedlinePlus Genetics, US National Library of Medicine | Plain-language description, updated November 2025 | Curated |
| GeneReviews (NCBI Bookshelf) | Expert chapters on individual subtypes. The LGMD overview chapter is retired (2012) and marked for historical reference only | Curated from current subtype chapters only |
| NORD Rare Disease Database (rarediseases.org) | Entries for LGMD and many subtypes | Curated |
| ClinVar and OMIM | Gene and variant records | Link only; OMIM licence terms apply |
| **Group 5: Patient organisations, general** |  |  |
| LGMD Awareness Foundation (lgmd-info.org) | Knowledge base in more than 15 languages; list of partner organisations | Curated; Community page |
| Muscular Dystrophy Association, USA (mda.org) | LGMD fact sheet (2026) | Curated; Community page |
| The Speak Foundation | LGMD advocacy and research | Community page |
| Deutsche Gesellschaft fuer Muskelkranke, LGMD group (dgm.org) | German-language information and peer support | Curated; Community page |
| Muscular Dystrophy UK, AFM-Telethon (France), UILDM (Italy) | National information and support | Curated; Community page |
| TREAT-NMD; World Muscle Society directory of patient groups | Neuromuscular network; directory of organisations | Finding further sources and groups |
| **Group 6: Subtype organisations and registries** |  |  |
| Coalition to Cure Calpain 3 (curecalpain3.org) and its LGMD2A/calpainopathy registry | LGMD R1 / 2A | Curated; Community page |
| Jain Foundation | Dysferlinopathy (LGMD2B) | Curated; Community page |
| CureLGMD2i Foundation; LGMD2i Research Fund; Global FKRP Registry | LGMD R9 / 2I | Curated; Community page |
| LGMD2D Foundation; LGMD2L Foundation; Kurt + Peter Foundation; other subtype groups listed by the LGMD Awareness Foundation | Individual subtypes | Community page, each verified by a person before listing |
| GRASP-LGMD consortium; Critical Path Institute LGMD task force (2024) | Natural history studies and trial-readiness work | Source of publications; link |
| **Group 7: Regulators** |  |  |
| European Medicines Agency; US Food and Drug Administration | Approval status of medicines | The only basis for any statement that a treatment is approved |

Patient registries hold personal data. The product links to them and never collects or imports registry data.

### C.2 What the sources agree on

This table shows that the background used in this document does not rest on one source. It is orientation for the build, not reviewed content.

| Statement | Sources |
|---|---|
| Weakness mainly affects muscles around the hips and thighs and the shoulders and upper arms | MDA fact sheet (2026); MedlinePlus Genetics (2025); Orphanet; GeneReviews overview (2012, historical) |
| Onset can be in childhood, adolescence or adulthood | MDA; MedlinePlus Genetics; GeneReviews overview (historical) |
| Severity and speed vary widely, even within one family | MedlinePlus Genetics; Orphanet; GeneReviews overview (historical) |
| Some subtypes can involve the heart or breathing | MDA; MedlinePlus Genetics; Orphanet; GeneReviews overview (historical) |
| Typical early difficulties are stairs, rising from a seat or from the floor; some people later use walking aids or a wheelchair | MDA; MedlinePlus Genetics; Orphanet |
| Subtypes are named R (recessive) or D (dominant); older LGMD1 and LGMD2 names are still in use | ENMC workshop (2018); MDA; GeneReviews overview uses the older names |
| **Sources differ:** number of subtypes | MDA: more than 30 subtypes. GeneReviews overview (2012): more than 50 genetic loci. The site says "more than 30" with source and date |
| **Sources differ:** how common LGMD is | MedlinePlus Genetics: 1 in 14,500 to 1 in 123,000. Orphanet: 1 to 9 in 100,000. The site shows the range (E27) |
| **Time-sensitive:** no approved disease-modifying medicine | MDA fact sheet (2026), referring to the US. Must be rechecked against the regulators before publication and at every review |
