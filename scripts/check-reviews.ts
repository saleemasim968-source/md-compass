/**
 * `npm run check:reviews` — fails (exit code 1) when any published condition
 * page is past its `nextReviewDue` date (docs/CONTENT_GUIDELINES.md §6).
 *
 * It loads content with the same loader as the site build, so invalid content
 * fails here too.
 */
import { ContentError, loadAllConditions } from "../lib/content/loader";
import { findOverdueReviews, formatReviewReport, todayUtc } from "../lib/content/reviews";

try {
  const conditions = await loadAllConditions();
  const today = todayUtc();
  const overdue = findOverdueReviews(conditions, today);
  const published = conditions.filter((condition) => condition.status === "published").length;
  const report = formatReviewReport(overdue, published, today);

  if (overdue.length > 0) {
    console.error(report);
    process.exitCode = 1;
  } else {
    console.log(report);
  }
} catch (error) {
  console.error(error instanceof ContentError ? error.message : error);
  process.exitCode = 1;
}
