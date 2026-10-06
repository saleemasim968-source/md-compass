# Accessibility — MD Compass

Implements `docs/PRD.md` §12 and §16. If this file and the PRD disagree, the
PRD wins. Accessibility failures block a release.

**Baseline:** WCAG 2.2 level AA. The rules below go further because of who the
product is for. LGMD typically weakens the shoulders and upper arms (PRD §12),
so reaching, holding a phone up and lifting an arm to the top of a screen can be
tiring. Sam and Jonas (PRD §4) are the primary personas: if a feature does not
work for them, it is not finished.

## Rules

| Area | Rule |
| --- | --- |
| Semantics | Real headings (one `h1`, no skipped levels), landmarks (`header`, `nav`, `main`, `footer`), lists and buttons. ARIA only when HTML cannot do the job. `<html lang>` is set. |
| Target size | Every control at least 48 × 48 px with 8 px between controls; 64 px with the "larger targets" setting. |
| Reach | Primary actions sit in the lower half of phone screens; nothing essential is only at the top of the screen; stage controls stay within reach without scrolling. |
| Gestures | No dragging, swiping, pinching, long-press, double-click or hover as the only way to do something. |
| Scrolling | Anything driven by scrolling also works with buttons and keys. |
| Time | No timeouts, no auto-advancing content, no messages that disappear by themselves. |
| Keyboard | Everything works by keyboard in a logical order; visible focus ring; "Skip to main content" is the first focusable element; no keyboard traps; the 3D canvas never takes focus. |
| Voice control | Every control has visible text and can be activated by saying it; no icon-only buttons; the accessible name contains the visible text. |
| Switch access | Few focus stops; related controls grouped. |
| Motion | Honour reduced motion (system and in-app setting); no flashing; nothing moves for more than five seconds without a pause control. |
| 3D | Full text equivalent; stage changes announced to screen readers; 3D can be switched off. |
| Reading | Contrast at least 4.5:1 (3:1 for large text and UI boundaries); base text 18 px, scalable to 200%; colour is never the only signal; relative units (`rem`). |
| Reflow | Works at 320 px wide and 200% zoom with no content cut off and no sideways scrolling (E21). |
| Slow connections | Text loads first; 3D and images never block reading (E22). |
| Links | Link text makes sense on its own. External links say they leave the site (R35). |
| Images | Meaningful images have alt text; decorative ones have `alt=""`. |
| Forms and filters | Every input has a visible label; results and errors are announced; empty results offer a one-tap "Clear filters" (E7). |
| Language | Plain language at a reading age of about 12 to 14 (`CONTENT_GUIDELINES.md` §4). |

## Settings (R24, R25)

Text size, high contrast, reduced motion, larger targets and spacing, 3D on or
off, and a dyslexia-friendly font. Stored on the device only; they follow the
operating system's preferences until the user changes them (E19, E20).

## Testing (PRD §16.1)

- **Automated, on every change:** axe-core via Playwright on every page, in both
  themes (default and high contrast), with zero violations allowed; keyboard,
  skip-link and 320 px reflow checks; `eslint-plugin-jsx-a11y`.
- **Manual, at the end of each phase:** keyboard only, screen reader (VoiceOver
  on macOS and iOS), voice control, switch control, 200% zoom, 320 px width,
  reduced motion, one thumb on a phone, slowed-down device.
- **Before launch:** sessions with at least three people with LGMD using their
  own setup.
