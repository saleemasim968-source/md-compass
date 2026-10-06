# Content Guidelines — MD Compass

This document has the **highest priority** (see `AGENTS.md`).

## 1. Who may write medical content

- **AI agents and developers must never write medical content.** They insert
  `TODO(content): <what is needed> — source + clinical review required`.
- Medical content is adapted from approved sources by a content author, then
  checked and signed off by the clinical reviewer.
- `TODO(decision)`: named clinical reviewer and their qualifications.

## 2. Approved sources

Only trusted public health sources, for example national health services,
government public-health agencies and international health organisations.
`TODO(decision)`: the exact approved source list.

Every page lists its sources (title, publisher, link, date accessed). Do not
copy text verbatim unless the source's licence allows it; adapt and cite.

## 3. Condition page structure

Every condition page uses the same sections in this order. The wording of
each section is `TODO(content)` until supplied by the content team.

1. Summary (2–3 sentences)
2. What it is
3. Common signs
4. When to get help, which uses the region config for emergency wording
5. How it is usually diagnosed
6. How it is usually treated or managed
7. Living with it
8. Sources
9. Review information (reviewed by, reviewed on, next review due)

`TODO(decision)`: confirm this section list.

## 4. Writing style

- Plain English. `TODO(decision)`: readability target (for example, a reading
  age of around 9–11).
- Short sentences, active voice, and "you" when speaking to the reader.
- Explain any medical term the first time it appears.
- Calm, non-alarming and non-judgemental tone.
- No personal advice, no diagnosis, no dosing.
- Use region config placeholders, never hard-coded emergency numbers.

## 5. Mandatory safety notice

Every condition page shows the safety notice (PRD F4). Its exact wording is
`TODO(content)` and must be approved by the clinical reviewer.

## 6. Review cycle

- Every published page has `reviewedOn` and `nextReviewDue`.
- `TODO(decision)`: review interval (for example, every 12 months).
- Pages past `nextReviewDue` are flagged in CI.
