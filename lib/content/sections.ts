/**
 * Condition page structure (docs/CONTENT_GUIDELINES.md §3).
 *
 * 1. Summary            → front-matter `summary`
 * 2–7. Body sections    → `##` headings in the MDX body, exactly these, in this order
 * 8. Sources            → front-matter `sources`, rendered by the page template
 * 9. Review information → front-matter `reviewedBy` / `reviewedOn` / `nextReviewDue`
 *
 * TODO(decision): the section list is not yet confirmed (CONTENT_GUIDELINES §3).
 */
export const BODY_SECTIONS = [
  "What it is",
  "Common signs",
  "When to get help",
  "How it is usually diagnosed",
  "How it is usually treated or managed",
  "Living with it",
] as const;

/** The body section that must contain the region-config emergency box. */
export const EMERGENCY_SECTION = "When to get help";

/** MDX tag authors use to place the region's emergency wording. */
export const EMERGENCY_COMPONENT = "EmergencyHelp";

export const SOURCES_HEADING = "Sources";
export const REVIEW_HEADING = "Review information";
