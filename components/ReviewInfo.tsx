import { REVIEW_HEADING } from "@/lib/content/sections";
import { FormattedDate } from "./FormattedDate";

type Props = {
  reviewedBy?: string;
  reviewedOn?: string;
  nextReviewDue?: string;
};

const NOT_REVIEWED = "Not yet reviewed";

/** Section 9 of a condition page (docs/CONTENT_GUIDELINES.md §3, §6). */
export function ReviewInfo({ reviewedBy, reviewedOn, nextReviewDue }: Props) {
  return (
    <section aria-labelledby="review-heading">
      <h2 id="review-heading">{REVIEW_HEADING}</h2>
      <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1">
        <dt className="font-semibold">Reviewed by</dt>
        <dd>{reviewedBy ?? NOT_REVIEWED}</dd>
        <dt className="font-semibold">Reviewed on</dt>
        <dd>{reviewedOn ? <FormattedDate value={reviewedOn} /> : NOT_REVIEWED}</dd>
        <dt className="font-semibold">Next review due</dt>
        <dd>{nextReviewDue ? <FormattedDate value={nextReviewDue} /> : NOT_REVIEWED}</dd>
      </dl>
    </section>
  );
}
