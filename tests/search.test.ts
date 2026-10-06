import {
  buildIndex,
  groupByLetter,
  letterFor,
  normalize,
  OTHER_GROUP,
  searchConditions,
  type IndexEntry,
} from "@/lib/search";

// Made-up names only: tests must never contain medical content.
const entry = (title: string, synonyms: string[] = [], draft = false): IndexEntry => ({
  slug: normalize(title).replace(/ /g, "-"),
  title,
  synonyms,
  draft,
});

const index: IndexEntry[] = [
  entry("Zebra example"),
  entry("Alpha example", ["First sample"]),
  entry("Example alpha"),
  entry("Beta’s example", ["Ébauche test"]),
  entry("4 Example"),
];

describe("normalize", () => {
  it("ignores case, accents, apostrophes and punctuation", () => {
    expect(normalize("  Beta’s  EXAMPLE-test ")).toBe("betas example test");
    expect(normalize("Ébauche")).toBe("ebauche");
  });
});

describe("buildIndex", () => {
  it("keeps only index fields, marks drafts and sorts A–Z", () => {
    const built = buildIndex([
      { slug: "b", title: "Bravo", synonyms: [], status: "published", body: "x" } as never,
      { slug: "a", title: "alpha", synonyms: ["one"], status: "draft" },
    ]);
    expect(built).toEqual([
      { slug: "a", title: "alpha", synonyms: ["one"], draft: true },
      { slug: "b", title: "Bravo", synonyms: [], draft: false },
    ]);
  });
});

describe("searchConditions", () => {
  it("returns nothing for an empty or blank query", () => {
    expect(searchConditions(index, "")).toEqual([]);
    expect(searchConditions(index, "  -- ")).toEqual([]);
  });

  it("puts titles starting with the query first, then other title matches, then synonyms", () => {
    const titles = searchConditions(index, "alpha").map((r) => r.entry.title);
    expect(titles).toEqual(["Alpha example", "Example alpha"]);

    const results = searchConditions(index, "sample");
    expect(results).toEqual([{ entry: index[1], matchedSynonym: "First sample" }]);
  });

  it("requires every word, in any order", () => {
    expect(searchConditions(index, "example zebra").map((r) => r.entry.title)).toEqual([
      "Zebra example",
    ]);
    expect(searchConditions(index, "zebra missing")).toEqual([]);
  });

  it("matches regardless of case, accents and apostrophes", () => {
    expect(searchConditions(index, "BETAS").map((r) => r.entry.title)).toEqual(["Beta’s example"]);
    expect(searchConditions(index, "ebauche")[0]?.matchedSynonym).toBe("Ébauche test");
  });

  it("matches partial words so results appear while typing", () => {
    expect(searchConditions(index, "zeb").map((r) => r.entry.title)).toEqual(["Zebra example"]);
  });
});

describe("groupByLetter", () => {
  it("groups by first letter A–Z, with non-letters last", () => {
    const groups = groupByLetter(index);
    expect(groups.map((g) => g.letter)).toEqual(["A", "B", "E", "Z", OTHER_GROUP]);
    expect(groups[0]?.entries.map((e) => e.title)).toEqual(["Alpha example"]);
  });

  it("files accented titles under their base letter", () => {
    expect(letterFor("Ébauche")).toBe("E");
    expect(letterFor("4 Example")).toBe(OTHER_GROUP);
  });
});
