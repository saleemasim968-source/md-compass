import type { Source } from "@/lib/content/schema";
import { SOURCES_HEADING } from "@/lib/content/sections";
import { FormattedDate } from "./FormattedDate";

/** Section 8 of a condition page (docs/CONTENT_GUIDELINES.md §2–3). */
export function SourcesList({ sources }: { sources: Source[] }) {
  return (
    <section aria-labelledby="sources-heading">
      <h2 id="sources-heading">{SOURCES_HEADING}</h2>
      {sources.length === 0 ? (
        <p>No sources yet. This page is a draft.</p>
      ) : (
        <ol className="list-decimal space-y-2 pl-6">
          {sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} rel="noopener noreferrer">
                {source.title}
                <span className="sr-only"> (external site)</span>
              </a>
              , {source.publisher}. Accessed <FormattedDate value={source.accessed} />.
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
