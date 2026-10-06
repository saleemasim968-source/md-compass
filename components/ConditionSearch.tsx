"use client";

import Link from "next/link";
import { useId, useState, useSyncExternalStore } from "react";
import {
  groupByLetter,
  OTHER_GROUP,
  searchConditions,
  type IndexEntry,
  type SearchResult,
} from "@/lib/search";

const noop = () => () => {};

/**
 * True once the page has loaded JavaScript in the browser. The search box needs
 * JavaScript, so it is only shown then; without it the full A–Z list still works.
 */
function useIsHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

function groupId(letter: string): string {
  return letter === OTHER_GROUP ? "letter-other" : `letter-${letter}`;
}

function DraftLabel() {
  return <span className="ml-2 text-sm font-normal text-muted">(draft)</span>;
}

/**
 * The condition index: an A–Z list of every visible condition, with an
 * on-device search over titles and synonyms (PRD F2–F3). Queries never leave
 * the browser (docs/ARCHITECTURE.md §6).
 */
export function ConditionSearch({ index }: { index: IndexEntry[] }) {
  const hydrated = useIsHydrated();
  const [query, setQuery] = useState("");
  const inputId = useId();
  const hintId = useId();

  if (index.length === 0) {
    return <p>No conditions have been published yet.</p>;
  }

  const searching = hydrated && query.trim() !== "";
  const results = searching ? searchConditions(index, query) : [];

  return (
    <div className="space-y-8">
      {hydrated && (
        <div role="search" className="space-y-2">
          <label htmlFor={inputId} className="block text-lg font-semibold">
            Search conditions
          </label>
          <p id={hintId} className="text-muted">
            Type a condition name or another name for it.
          </p>
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-describedby={hintId}
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded border-2 border-muted bg-paper px-3 py-2 text-lg"
          />
          {/* Always in the page so screen readers announce changes to the result count. */}
          <p role="status" className="min-h-[1.6em] font-semibold">
            {searching && resultCountText(results.length)}
          </p>
        </div>
      )}

      {searching ? <SearchResults results={results} /> : <AlphabeticalList index={index} />}
    </div>
  );
}

function resultCountText(count: number): string {
  if (count === 0) return "No conditions found.";
  return count === 1 ? "1 condition found." : `${count} conditions found.`;
}

function SearchResults({ results }: { results: SearchResult[] }) {
  return (
    <section aria-labelledby="results-heading" className="space-y-4">
      <h2 id="results-heading" className="text-2xl font-bold">
        Search results
      </h2>
      {results.length === 0 ? (
        <p>
          Check the spelling, try fewer words, or browse the A to Z list by clearing the search.
        </p>
      ) : (
        <ul className="space-y-3">
          {results.map(({ entry, matchedSynonym }) => (
            <li key={entry.slug}>
              <Link href={`/conditions/${entry.slug}`} className="text-lg font-semibold">
                {entry.title}
              </Link>
              {entry.draft && <DraftLabel />}
              {matchedSynonym !== undefined && (
                <p className="text-muted">Also called: {matchedSynonym}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function AlphabeticalList({ index }: { index: IndexEntry[] }) {
  const groups = groupByLetter(index);
  return (
    <div className="space-y-8">
      <nav aria-label="Jump to letter">
        <ul className="flex flex-wrap gap-2">
          {groups.map(({ letter }) => (
            <li key={letter}>
              <a
                href={`#${groupId(letter)}`}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded border border-line font-semibold no-underline"
              >
                {letter === OTHER_GROUP ? (
                  <>
                    <span aria-hidden="true">#</span>
                    <span className="sr-only">Numbers and other characters</span>
                  </>
                ) : (
                  letter
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {groups.map(({ letter, entries }) => (
        <section key={letter} aria-labelledby={groupId(letter)} className="space-y-3">
          <h2 id={groupId(letter)} className="text-2xl font-bold">
            {letter === OTHER_GROUP ? "Numbers and other characters" : letter}
          </h2>
          <ul className="space-y-2">
            {entries.map((entry) => (
              <li key={entry.slug}>
                <Link href={`/conditions/${entry.slug}`} className="text-lg">
                  {entry.title}
                </Link>
                {entry.draft && <DraftLabel />}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
