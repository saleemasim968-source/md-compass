// @vitest-environment node
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { z } from "zod";
import {
  compileBody,
  CONTENT_PLACEHOLDER,
  ContentError,
  loadContentDir,
  type ParseOptions,
  parseContentFile,
  shouldIncludeDrafts,
} from "@/lib/content/files";

// Neutral, non-medical fixtures only (AGENTS.md). The schema is a stand-in for
// a real content type such as a guide.
const schema = z.object({ title: z.string().min(1), status: z.enum(["draft", "published"]) });

const file = (frontmatter: string, body = "## Section\n\nExample text.") =>
  `---\n${frontmatter}\n---\n\n${body}\n`;

const valid = file("title: Example\nstatus: published");

function problemsFor(
  fileName: string,
  raw: string,
  options?: ParseOptions<z.infer<typeof schema>>,
) {
  const result = parseContentFile(fileName, raw, schema, options);
  return result.ok ? [] : result.problems;
}

describe("parseContentFile", () => {
  it("accepts a valid file and takes the slug from the file name", () => {
    const result = parseContentFile("my-example.mdx", valid, schema);
    expect(result.ok && result.item).toMatchObject({
      title: "Example",
      slug: "my-example",
      fileName: "my-example.mdx",
    });
  });

  it("rejects file names that would make bad web addresses", () => {
    expect(problemsFor("My Example.mdx", valid)[0]).toMatch(/lowercase words joined by hyphens/);
  });

  it("rejects a file without front-matter", () => {
    expect(problemsFor("example.mdx", "## Section")[0]).toMatch(/missing front-matter/);
  });

  it("rejects invalid YAML", () => {
    expect(problemsFor("example.mdx", file("title: [unclosed"))[0]).toMatch(/not valid YAML/);
  });

  it("reports schema problems with the field name", () => {
    expect(problemsFor("example.mdx", file("title: Example\nstatus: live")).join("\n")).toMatch(
      /example\.mdx: status /,
    );
  });

  it("rejects import/export statements and level-1 headings", () => {
    const problems = problemsFor(
      "example.mdx",
      file("title: Example\nstatus: draft", 'import X from "./x"\n\n# Title'),
    ).join("\n");
    expect(problems).toMatch(/import\/export statements are not allowed/);
    expect(problems).toMatch(/do not use "# " headings/);
  });

  it("ignores # lines inside code blocks", () => {
    const body = "```\n# not a heading\n```";
    expect(problemsFor("example.mdx", file("title: Example\nstatus: draft", body))).toEqual([]);
  });

  it("runs the content type's own checks", () => {
    const check = {
      check: (item: { status: string }, raw: string) =>
        item.status === "published" && raw.includes(CONTENT_PLACEHOLDER)
          ? ["a published file must not contain placeholders"]
          : [],
    };
    const withPlaceholder = file("title: Example\nstatus: published", "TODO(content): text");
    expect(problemsFor("example.mdx", withPlaceholder, check)).toEqual([
      "example.mdx: a published file must not contain placeholders",
    ]);
  });
});

describe("loadContentDir", () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "mdc-content-"));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("loads valid files in file-name order and ignores other files", async () => {
    await writeFile(path.join(dir, "b.mdx"), valid);
    await writeFile(path.join(dir, "a.mdx"), valid);
    await writeFile(path.join(dir, "notes.txt"), "ignored");
    const items = await loadContentDir(dir, schema);
    expect(items.map((item) => item.slug)).toEqual(["a", "b"]);
  });

  it("throws one ContentError listing problems from every invalid file", async () => {
    await writeFile(path.join(dir, "a.mdx"), "no front-matter");
    await writeFile(path.join(dir, "b.mdx"), "also none");
    const error = await loadContentDir(dir, schema).catch((e: unknown) => e);
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
  it("renders Markdown and supplied components", async () => {
    const Body = await compileBody("## Section\n\n<Note />");
    const html = renderToStaticMarkup(
      createElement(Body, { components: { Note: () => createElement("aside", null, "N") } }),
    );
    expect(html).toContain("<h2>Section</h2>");
    expect(html).toContain("<aside>N</aside>");
  });
});
