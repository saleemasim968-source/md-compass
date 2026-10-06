// @vitest-environment node
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  compileBody,
  ContentError,
  loadAllConditions,
  parseConditionFile,
  shouldIncludeDrafts,
} from "@/lib/content/loader";
import { BODY_SECTIONS } from "@/lib/content/sections";

// Neutral, non-medical fixture text only (AGENTS.md rule 1).
const body = (sections: readonly string[] = BODY_SECTIONS) =>
  sections
    .map(
      (s) => `## ${s}\n\nExample text.${s === "When to get help" ? "\n\n<EmergencyHelp />" : ""}`,
    )
    .join("\n\n");

const publishedFrontmatter = `title: Example condition
slug: example
summary: Example summary.
synonyms: [Example synonym]
status: published
sources:
  - title: Example source
    publisher: Example publisher
    url: https://example.org/page
    accessed: "2026-10-01"
reviewedBy: Example Reviewer
reviewedOn: "2026-10-01"
nextReviewDue: "2027-10-01"`;

const file = (frontmatter: string, content = body()) => `---\n${frontmatter}\n---\n\n${content}\n`;

function problemsFor(fileName: string, raw: string): string[] {
  const result = parseConditionFile(fileName, raw);
  return result.ok ? [] : result.problems;
}

describe("parseConditionFile", () => {
  it("accepts a complete published page", () => {
    const result = parseConditionFile("example.mdx", file(publishedFrontmatter));
    expect(result.ok).toBe(true);
  });

  it("accepts a minimal draft", () => {
    const draft = "title: Example\nslug: example\nsummary: Example.\nstatus: draft";
    expect(problemsFor("example.mdx", file(draft))).toEqual([]);
  });

  it("rejects a file without front-matter", () => {
    expect(problemsFor("example.mdx", body())[0]).toMatch(/missing front-matter/);
  });

  it("rejects a published page with no sources or review information", () => {
    const fm = "title: Example\nslug: example\nsummary: Example.\nstatus: published\nsources: []";
    const problems = problemsFor("example.mdx", file(fm)).join("\n");
    expect(problems).toMatch(/sources a published page needs at least one source/);
    expect(problems).toMatch(/reviewedBy is required/);
    expect(problems).toMatch(/reviewedOn is required/);
    expect(problems).toMatch(/nextReviewDue is required/);
  });

  it("explains an invalid status in plain words", () => {
    const fm = "title: Example\nslug: example\nsummary: Example.\nstatus: live";
    expect(problemsFor("example.mdx", file(fm))).toEqual([
      'example.mdx: status must be "draft" or "published"',
    ]);
  });

  it("rejects a next review date that is not after the review date", () => {
    const fm = publishedFrontmatter.replace(
      'nextReviewDue: "2027-10-01"',
      'nextReviewDue: "2026-09-01"',
    );
    expect(problemsFor("example.mdx", file(fm)).join("\n")).toMatch(/nextReviewDue must be after/);
  });

  it("rejects a source link that is not https", () => {
    const fm = publishedFrontmatter.replace("https://example.org/page", "http://example.org/page");
    expect(problemsFor("example.mdx", file(fm)).join("\n")).toMatch(/sources\.0\.url/);
  });

  it("rejects a slug that does not match the file name", () => {
    expect(problemsFor("other.mdx", file(publishedFrontmatter)).join("\n")).toMatch(
      /does not match the file name/,
    );
  });

  it("rejects missing or out-of-order sections", () => {
    const swapped = [...BODY_SECTIONS];
    [swapped[0], swapped[1]] = [swapped[1]!, swapped[0]!];
    expect(
      problemsFor("example.mdx", file(publishedFrontmatter, body(swapped))).join("\n"),
    ).toMatch(/headings must be exactly/);
    expect(
      problemsFor("example.mdx", file(publishedFrontmatter, body(BODY_SECTIONS.slice(1)))).join(
        "\n",
      ),
    ).toMatch(/headings must be exactly/);
  });

  it("rejects a level-1 heading in the body", () => {
    const content = `# Extra title\n\n${body()}`;
    expect(problemsFor("example.mdx", file(publishedFrontmatter, content)).join("\n")).toMatch(
      /do not use "# " headings/,
    );
  });

  it("requires <EmergencyHelp /> inside the When to get help section", () => {
    const content = body().replace("<EmergencyHelp />", "");
    expect(problemsFor("example.mdx", file(publishedFrontmatter, content)).join("\n")).toMatch(
      /must include <EmergencyHelp \/>/,
    );
  });

  it("rejects import/export statements", () => {
    const content = `import X from "./x"\n\n${body()}`;
    expect(problemsFor("example.mdx", file(publishedFrontmatter, content)).join("\n")).toMatch(
      /import\/export statements are not allowed/,
    );
  });

  it("rejects TODO(content) placeholders on a published page but allows them in drafts", () => {
    const content = body().replace("Example text.", "TODO(content): something");
    expect(problemsFor("example.mdx", file(publishedFrontmatter, content)).join("\n")).toMatch(
      /must not contain TODO\(content\)/,
    );
    const draftFm = publishedFrontmatter.replace("status: published", "status: draft");
    expect(problemsFor("example.mdx", file(draftFm, content))).toEqual([]);
  });
});

describe("loadAllConditions", () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "mdc-content-"));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("loads valid files", async () => {
    await writeFile(path.join(dir, "example.mdx"), file(publishedFrontmatter));
    const conditions = await loadAllConditions(dir);
    expect(conditions.map((c) => c.slug)).toEqual(["example"]);
  });

  it("throws one ContentError listing problems from every invalid file", async () => {
    await writeFile(path.join(dir, "a.mdx"), "no front-matter");
    await writeFile(path.join(dir, "b.mdx"), "also none");
    const error = await loadAllConditions(dir).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ContentError);
    expect((error as ContentError).problems).toHaveLength(2);
    expect((error as ContentError).message).toMatch(/a\.mdx[\s\S]*b\.mdx/);
  });
});

describe("shouldIncludeDrafts", () => {
  it("hides drafts in production unless explicitly enabled", () => {
    expect(shouldIncludeDrafts({ NODE_ENV: "production" })).toBe(false);
    expect(shouldIncludeDrafts({ NODE_ENV: "production", MDC_INCLUDE_DRAFTS: "true" })).toBe(true);
    expect(shouldIncludeDrafts({ NODE_ENV: "development" })).toBe(true);
  });
});

describe("compileBody", () => {
  it("renders headings and the EmergencyHelp component", async () => {
    const Body = await compileBody(body());
    const html = renderToStaticMarkup(
      createElement(Body, {
        components: { EmergencyHelp: () => createElement("aside", null, "EH") },
      }),
    );
    expect(html).toContain("<h2>What it is</h2>");
    expect(html).toContain("<aside>EH</aside>");
  });
});

describe("repository content", () => {
  it("every file in content/conditions is valid", async () => {
    await expect(loadAllConditions()).resolves.not.toHaveLength(0);
  });
});
