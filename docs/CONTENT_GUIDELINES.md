# Content Guidelines — MD Compass

Implements `docs/PRD.md` §13 and Appendix C. If this file and the PRD disagree,
the PRD wins. After the PRD, this document has the highest priority (see
`AGENTS.md`).

## 1. Who may write medical content

- **AI agents and developers never write medical content**: no facts, stages,
  ages, statistics, sources, community entries or search terms, and nothing
  from general knowledge. They insert
  `TODO(content): <what is needed> — source + clinical review required`
  and list each one in their report.
- A content author writes from the source register, in original words, and a
  clinical reviewer signs it off.
- `TODO(decision)`: who performs the clinical review, a neuromuscular clinician
  or an LGMD patient organisation (PRD §19).

## 2. Sources

- Only sources in the source register (`content/sources.json`, started from PRD
  Appendix C): guidelines and care recommendations, peer-reviewed research,
  reference databases, health agencies and established patient organisations.
- Forums, social media, product pages and AI output are **not** sources.
- New sources are added by a person, never by an AI (R41).
- Each source is used with its date. Retired or superseded documents are marked
  historical and are not used for current statements.
- Statements that a treatment is approved rest only on the regulators (PRD
  Appendix C, group 7) and are rechecked at every review.
- Summarise in original words and link. No copied passages (R11).

### Two-source rule (R42)

- A general medical statement is supported by at least two independent sources
  where two exist.
- Where sources disagree, show the range and name both. Never pick one figure
  (E27).

## 3. General and subtype statements

- The first version describes the general LGMD pattern. Label general
  statements as general.
- A statement about one subtype names that subtype and cites a source for it.
- Subtype names follow the current R and D naming. Older names are mapped only
  through the reviewed table in `content/subtypes.json` (E23).

## 4. Writing style

- Plain language at a reading age of about 12 to 14. Explain medical terms where
  they appear.
- Use "typically" and "varies from person to person". No predictions about an
  individual.
- Pair every "what changes" with "what helps".
- No treatment recommendations, dosing, exercise prescriptions, brand names or
  cure claims.
- Respectful language: "people with LGMD", "uses a wheelchair". Never
  "sufferers" or "wheelchair-bound".
- Stages are defined by function, never by age. Age of onset appears only as
  sourced context; no life-expectancy figures (R22).

## 5. Templates

### Daily Living guide (R10–R13)

Front-matter as in PRD §9.2. Every guide has, in this order: summary,
step-by-step tips, equipment that may help, who to ask, sources, last-reviewed
date. It can be read in under three minutes and printed. Categories are listed
in PRD §7.2. A guide without a source fails the production build (E12).

### Timeline stage (R14, R29, R30)

Three panels: what typically changes, what helps at this stage, related guides.
Each stage says that paths differ. A sourced note about checks with the care
team appears at every stage; its wording comes from sources. The five stage
names are a proposal until the clinical reviewer confirms them (PRD §7.3).

### Community entry (R33–R35)

Front-matter as in PRD §9.5, with a "last checked" date. Listing criteria are
published on the page. `TODO(decision)`: the listing criteria and who checks
entries (PRD §19).

## 6. Reviews and corrections

- Until clinical review, every page shows the banner
  "Draft content, not yet clinically reviewed" (PRD §13).
- A guide whose last review is more than 12 months old shows a "Review due"
  note (E11).
- The source register is reviewed every three months; a source not checked for
  more than three months is flagged on the Sources page and in the build report
  (R41, E28).
- Community links are checked monthly; a broken link hides the entry until a
  person fixes it (E24).
- The About page has an error-report link; corrections are dated.

## 7. Safety wording owned by people

The footer disclaimer (R27), the timeline content note (R21), the trial line in
R8 and any heart or breathing note (R30) are fixed wording supplied by the
content team and approved by the clinical reviewer.
