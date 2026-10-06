import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About MD Compass and our sources",
  // TODO(content): about page description for search engines — source + clinical review required
  description: "About MD Compass and our sources",
};

/**
 * About and sources page (PRD F5): explains how content is sourced and
 * reviewed. Every statement here describes the clinical process and must come
 * from the content team and be approved by the clinical reviewer
 * (docs/CONTENT_GUIDELINES.md §1–2, §6).
 */
export default function AboutPage() {
  return (
    <article className="space-y-8">
      <h1 className="text-3xl font-bold">About MD Compass and our sources</h1>

      <p className="text-lg">
        {/* TODO(content): what MD Compass is and is not — source + clinical review required */}
        TODO(content): what MD Compass is and is not
      </p>

      <section aria-labelledby="sources-heading" className="space-y-3">
        <h2 id="sources-heading" className="text-2xl font-bold">
          Where our information comes from
        </h2>
        <p>
          {/* TODO(content): how sources are chosen — source + clinical review required */}
          TODO(content): how sources are chosen
        </p>
        <p>
          {/* TODO(decision): the approved source list (docs/CONTENT_GUIDELINES.md §2). */}
          TODO(decision): approved source list
        </p>
      </section>

      <section aria-labelledby="writing-heading" className="space-y-3">
        <h2 id="writing-heading" className="text-2xl font-bold">
          How pages are written
        </h2>
        <p>
          {/* TODO(content): how pages are adapted into plain language and cited — source + clinical review required */}
          TODO(content): how pages are adapted into plain language and cited
        </p>
      </section>

      <section aria-labelledby="review-heading" className="space-y-3">
        <h2 id="review-heading" className="text-2xl font-bold">
          How pages are reviewed
        </h2>
        <p>
          {/* TODO(content): clinical review process — source + clinical review required */}
          TODO(content): clinical review process
        </p>
        <p>
          {/* TODO(decision): named clinical reviewer and qualifications; review interval. */}
          TODO(decision): clinical reviewer and review interval
        </p>
      </section>

      <section aria-labelledby="privacy-heading" className="space-y-3">
        <h2 id="privacy-heading" className="text-2xl font-bold">
          Your privacy
        </h2>
        <p>
          {/* TODO(content): privacy statement (no accounts, on-device search) — owner approval required */}
          TODO(content): privacy statement
        </p>
      </section>
    </article>
  );
}
