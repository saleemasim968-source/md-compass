# Product Requirements — MD Compass

## 1. Summary

MD Compass explains medical conditions in plain language for patients and the
general public. Every explanation is adapted from trusted public health
sources, cites those sources, and is clinically reviewed before it is
published. It is information, not diagnosis or personal advice.

## 2. Problem

People who are given a diagnosis, or who want to understand a condition,
often find information that is too technical, inconsistent, or untrustworthy.
They need a calm, readable, well-sourced explanation they can trust.

## 3. Users

- **Primary:** members of the public, including patients and carers, with no
  medical training.
- Users may be anxious, reading on a phone, using assistive technology, or
  have limited health literacy. Design for all of them (see
  `ACCESSIBILITY.md`).

## 4. Goals

- G1: A person can find a condition and understand the basics in a few minutes.
- G2: Every medical statement is traceable to a cited, trusted source.
- G3: Every published page has been clinically reviewed, with a visible
  "last reviewed" date.
- G4: The site meets WCAG 2.2 AA.
- G5: No personal data is collected.

## 5. Non-goals (first version)

- Symptom checking, diagnosis, triage or personalised advice
- User accounts, saved history, or any personal health data
- Medication dosing calculators
- Content for clinicians
- Region-specific service directories (the site is region-neutral; see §7)

## 6. Core features (first version)

| ID | Feature | Notes |
| --- | --- | --- |
| F1 | Condition page | Standard sections defined in `CONTENT_GUIDELINES.md`; sources and review date shown |
| F2 | Condition index (A–Z) | Browse every published condition |
| F3 | Search | Search condition names and synonyms |
| F4 | Safety notice | Shown on every condition page: this is information, not advice; seek urgent help if worried |
| F5 | About and sources page | Explains how content is sourced and reviewed |

## 7. Region

The product is **region-neutral**. Emergency numbers and service names must
not be hard-coded into content. They come from a single configuration value.
`TODO(decision)`: which region(s) to support first, and what the default
emergency wording is when no region is set.

## 8. Content model

Content comes from trusted public sources (for example national health
services and international health bodies), adapted into plain language, cited,
and reviewed by a clinician. The approved source list and the reviewer are
defined in `CONTENT_GUIDELINES.md`.

## 9. Success measures

- Readability target met on every page (see `CONTENT_GUIDELINES.md`)
- 100% of published pages have sources and a review date
- Zero automated accessibility violations (axe) in CI
- `TODO(decision)`: any usage metric, which must be privacy-preserving and
  must not identify anyone

## 10. Open questions

- `TODO(decision)`: Who is the named clinical reviewer?
- `TODO(decision)`: Which conditions are in the first set?
- `TODO(decision)`: Which languages? (English only assumed for now)
- `TODO(decision)`: Hosting and domain
