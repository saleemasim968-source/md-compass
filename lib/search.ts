/**
 * On-device condition search (docs/ARCHITECTURE.md §1, §6; PRD F2–F3).
 *
 * The index is built at build time from the condition files and sent to the
 * browser with the page. Searching happens entirely in the browser; queries are
 * never sent anywhere.
 */

/** One entry in the search index: only what the index page and search need. */
export type IndexEntry = {
  slug: string;
  title: string;
  synonyms: string[];
  draft: boolean;
};

/** A search result: the entry, plus the synonym that matched when the title did not. */
export type SearchResult = {
  entry: IndexEntry;
  matchedSynonym?: string;
};

/** A group of entries sharing a first letter, for the A–Z list. */
export type LetterGroup = {
  letter: string;
  entries: IndexEntry[];
};

/** Group label for titles that do not start with a letter A–Z. */
export const OTHER_GROUP = "#";

/** Builds the index from loaded conditions, sorted A–Z by title. */
export function buildIndex(
  conditions: { slug: string; title: string; synonyms: string[]; status: string }[],
): IndexEntry[] {
  return conditions
    .map((condition) => ({
      slug: condition.slug,
      title: condition.title,
      synonyms: condition.synonyms,
      draft: condition.status === "draft",
    }))
    .sort(compareEntries);
}

const collator = new Intl.Collator("en", { sensitivity: "base", numeric: true });

function compareEntries(a: IndexEntry, b: IndexEntry): number {
  return collator.compare(a.title, b.title);
}

/**
 * Lower-cases, removes accents and turns punctuation into spaces, so that
 * "Beta's", "betas" and "BETA S" are treated alike.
 */
export function normalize(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/** True when every word of the (normalised) query appears in the (normalised) text. */
function matchesAllWords(text: string, words: string[]): boolean {
  return words.every((word) => text.includes(word));
}

/**
 * Finds conditions whose title or synonyms contain every word of the query.
 * Titles that start with the query come first, then other title matches, then
 * synonym-only matches; each group is A–Z. An empty query returns no results.
 */
export function searchConditions(index: IndexEntry[], query: string): SearchResult[] {
  const normalizedQuery = normalize(query);
  if (normalizedQuery === "") return [];
  const words = normalizedQuery.split(" ");

  const ranked: { result: SearchResult; rank: number }[] = [];
  for (const entry of index) {
    const title = normalize(entry.title);
    if (matchesAllWords(title, words)) {
      ranked.push({ result: { entry }, rank: title.startsWith(normalizedQuery) ? 0 : 1 });
      continue;
    }
    const synonym = entry.synonyms.find((s) => matchesAllWords(normalize(s), words));
    if (synonym !== undefined) {
      ranked.push({ result: { entry, matchedSynonym: synonym }, rank: 2 });
    }
  }

  return ranked
    .sort((a, b) => a.rank - b.rank || compareEntries(a.result.entry, b.result.entry))
    .map(({ result }) => result);
}

/** The A–Z heading a title belongs under ("#" for digits and other characters). */
export function letterFor(title: string): string {
  const first = normalize(title).charAt(0).toUpperCase();
  return /^[A-Z]$/.test(first) ? first : OTHER_GROUP;
}

/** Groups entries by first letter, A–Z, with "#" last. Empty letters are left out. */
export function groupByLetter(index: IndexEntry[]): LetterGroup[] {
  const groups = new Map<string, IndexEntry[]>();
  for (const entry of [...index].sort(compareEntries)) {
    const letter = letterFor(entry.title);
    groups.set(letter, [...(groups.get(letter) ?? []), entry]);
  }
  return [...groups.entries()]
    .map(([letter, entries]) => ({ letter, entries }))
    .sort((a, b) =>
      a.letter === OTHER_GROUP
        ? 1
        : b.letter === OTHER_GROUP
          ? -1
          : a.letter.localeCompare(b.letter),
    );
}
