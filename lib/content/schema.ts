import { z } from "zod";

/**
 * Front-matter schema for content/conditions/*.mdx (docs/ARCHITECTURE.md §4).
 *
 * Drafts may be incomplete. Published pages must have at least one source and
 * full review information, or the build fails.
 *
 * Error messages are written for content authors, not developers.
 */

/** Says "is required" when a field is missing, otherwise `message`. */
const requiredOr = (message: string) => (issue: { input?: unknown }) =>
  issue.input === undefined ? "is required" : message;

const text = z
  .string({ error: requiredOr("must be text") })
  .trim()
  .min(1, "must not be empty");
const isoDate = z.iso.date({ error: requiredOr("must be a date written as YYYY-MM-DD") });

export const sourceSchema = z.object(
  {
    title: text,
    publisher: text,
    url: z.url({ protocol: /^https$/, error: requiredOr("must be a full https:// link") }),
    accessed: isoDate,
  },
  { error: "each source needs title, publisher, url and accessed" },
);

const baseFields = {
  title: text,
  slug: text.regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "must be lowercase words joined by hyphens, e.g. my-condition",
  ),
  summary: text,
  synonyms: z.array(text, { error: requiredOr("must be a list") }).default([]),
};

const draftSchema = z.object({
  ...baseFields,
  status: z.literal("draft"),
  sources: z.array(sourceSchema, { error: requiredOr("must be a list") }).default([]),
  reviewedBy: text.optional(),
  reviewedOn: isoDate.optional(),
  nextReviewDue: isoDate.optional(),
});

const publishedSchema = z
  .object({
    ...baseFields,
    status: z.literal("published"),
    sources: z
      .array(sourceSchema, { error: requiredOr("must be a list") })
      .min(1, "a published page needs at least one source"),
    reviewedBy: text,
    reviewedOn: isoDate,
    nextReviewDue: isoDate,
  })
  .refine((page) => page.nextReviewDue > page.reviewedOn, {
    path: ["nextReviewDue"],
    message: "must be after reviewedOn",
  });

export const frontmatterSchema = z.discriminatedUnion("status", [draftSchema, publishedSchema], {
  error: 'must be "draft" or "published"',
});

export type Source = z.infer<typeof sourceSchema>;
export type ConditionFrontmatter = z.infer<typeof frontmatterSchema>;
