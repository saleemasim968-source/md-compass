# Accessibility — MD Compass

Target: **WCAG 2.2 level AA** on every page. Accessibility failures block a
release.

## Rules

1. **Semantic HTML first.** Use real headings (one `h1` per page, no skipped
   levels), landmarks (`header`, `nav`, `main`, `footer`), lists and buttons.
   ARIA only when HTML cannot do the job.
2. **Keyboard.** Everything works with keyboard alone, in a logical order, with
   a clearly visible focus indicator. A "Skip to main content" link is the first
   focusable element.
3. **Contrast.** Text at least 4.5:1 (3:1 for large text and UI boundaries).
   Never use colour alone to convey meaning.
4. **Text size and reflow.** Works at 200% zoom and at 320 CSS px wide with no
   horizontal scrolling. Use relative units (`rem`).
5. **Motion.** Respect `prefers-reduced-motion`. No auto-playing animation.
6. **Links.** Link text makes sense out of context ("Read about sources", not
   "click here"). External links say they are external.
7. **Images.** Meaningful images have alt text; decorative ones have `alt=""`.
8. **Language.** `<html lang>` is set. Plain language rules are in
   `CONTENT_GUIDELINES.md`.
9. **Forms (search).** Every input has a visible label; errors are announced.
10. **Touch targets** are at least 24×24 CSS px (44×44 preferred).

## Testing

- Automated: axe-core via Playwright on every page in CI, with zero violations allowed.
- Lint: `eslint-plugin-jsx-a11y`.
- Manual, per phase: keyboard-only walkthrough, screen reader check (VoiceOver
  on macOS/iOS), 200% zoom, and a mobile-width check.
