import type { Condition } from "./loader";

/**
 * Review-date checks (docs/CONTENT_GUIDELINES.md §6): every published page has
 * a `nextReviewDue` date, and pages past that date are flagged in CI.
 */

export type OverduePage = {
  fileName: string;
  title: string;
  nextReviewDue: string;
};

/** Today's date as YYYY-MM-DD in UTC, so the result does not depend on the machine's time zone. */
export function todayUtc(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

/**
 * Published pages whose `nextReviewDue` is before `today` (both YYYY-MM-DD).
 * A page is still in date on its due day. Drafts are never published, so they
 * are not checked. Sorted most overdue first.
 */
export function findOverdueReviews(conditions: Condition[], today: string): OverduePage[] {
  return conditions
    .flatMap((condition) =>
      condition.status === "published" && condition.nextReviewDue < today
        ? [
            {
              fileName: condition.fileName,
              title: condition.title,
              nextReviewDue: condition.nextReviewDue,
            },
          ]
        : [],
    )
    .sort((a, b) => a.nextReviewDue.localeCompare(b.nextReviewDue));
}

/** The message printed by `npm run check:reviews`. */
export function formatReviewReport(overdue: OverduePage[], checked: number, today: string): string {
  if (overdue.length === 0) {
    return `Review dates OK: ${checked} published page(s) checked on ${today}; none are past their next review date.`;
  }
  const lines = overdue.map(
    (page) => `  - ${page.fileName} ("${page.title}"): next review was due ${page.nextReviewDue}`,
  );
  return [
    `${overdue.length} published page(s) are past their next review date (checked on ${today}):`,
    ...lines,
    "",
    "Ask the clinical reviewer to review each page, then update reviewedOn and nextReviewDue.",
  ].join("\n");
}
