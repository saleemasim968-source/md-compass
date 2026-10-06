// @vitest-environment node
import type { Condition } from "@/lib/content/loader";
import { findOverdueReviews, formatReviewReport, todayUtc } from "@/lib/content/reviews";

// Neutral, non-medical fixture text only (AGENTS.md rule 1).
function published(slug: string, nextReviewDue: string): Condition {
  return {
    title: `Example ${slug}`,
    slug,
    summary: "Example summary.",
    synonyms: [],
    status: "published",
    sources: [
      {
        title: "Example source",
        publisher: "Example publisher",
        url: "https://example.org/page",
        accessed: "2025-01-01",
      },
    ],
    reviewedBy: "Example Reviewer",
    reviewedOn: "2025-01-01",
    nextReviewDue,
    fileName: `${slug}.mdx`,
    body: "",
  };
}

const draft: Condition = {
  title: "Example draft",
  slug: "draft",
  summary: "Example summary.",
  synonyms: [],
  status: "draft",
  sources: [],
  nextReviewDue: "2000-01-01",
  fileName: "draft.mdx",
  body: "",
};

describe("findOverdueReviews", () => {
  const today = "2026-10-06";

  it("flags published pages whose next review date has passed, most overdue first", () => {
    const overdue = findOverdueReviews(
      [published("b", "2026-10-05"), published("ok", "2027-01-01"), published("a", "2026-01-01")],
      today,
    );
    expect(overdue.map((page) => page.fileName)).toEqual(["a.mdx", "b.mdx"]);
  });

  it("treats a page as in date on its due day", () => {
    expect(findOverdueReviews([published("due-today", today)], today)).toEqual([]);
  });

  it("ignores drafts", () => {
    expect(findOverdueReviews([draft], today)).toEqual([]);
  });
});

describe("todayUtc", () => {
  it("uses the UTC date regardless of local time zone", () => {
    expect(todayUtc(new Date("2026-10-06T23:30:00-05:00"))).toBe("2026-10-07");
  });
});

describe("formatReviewReport", () => {
  it("names each overdue file and its due date", () => {
    const report = formatReviewReport(
      [{ fileName: "a.mdx", title: "Example a", nextReviewDue: "2026-01-01" }],
      3,
      "2026-10-06",
    );
    expect(report).toContain('a.mdx ("Example a"): next review was due 2026-01-01');
    expect(report).toContain("1 published page(s) are past their next review date");
  });

  it("says how many pages were checked when all are in date", () => {
    expect(formatReviewReport([], 3, "2026-10-06")).toContain("3 published page(s) checked");
  });
});
