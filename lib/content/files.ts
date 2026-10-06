import { evaluate } from "@mdx-js/mdx";
import type { MDXContent } from "mdx/types";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import * as runtime from "react/jsx-runtime";
import { parse as parseYaml } from "yaml";
import type { z } from "zod";

/**
 * Generic loader for curated content files: MDX with YAML front-matter
 * (docs/ARCHITECTURE.md §4). Each content type (guides, stages, sources,
 * community entries) supplies its own Zod schema and extra checks; this module
 * only does the shared work. Any problem fails `next build` with a list of every
 * problem in every file.
 */

/** Root folder for all curated content. */
export const CONTENT_ROOT = path.join(process.cwd(), "content");

/** Marker for wording a person must supply (AGENTS.md). */
export const CONTENT_PLACEHOLDER = "TODO(content)";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type ContentFile<T> = T & {
  /** File name without ".mdx"; used in web addresses. */
  slug: string;
  /** File name the item came from, for error messages. */
  fileName: string;
  /** Raw MDX body (everything after the front-matter). */
  body: string;
};

export type ParseOptions<T> = {
  /** Extra checks for this content type. Return plain-language problems, or none. */
  check?: (item: ContentFile<T>, raw: string) => string[];
};

/** Thrown when one or more content files are invalid. Lists every problem at once. */
export class ContentError extends Error {
  constructor(readonly problems: string[]) {
    super(`Invalid content:\n${problems.map((p) => `  - ${p}`).join("\n")}`);
    this.name = "ContentError";
  }
}

/**
 * Drafts are only shown in development, or in a build made with
 * MDC_INCLUDE_DRAFTS=true (used by the end-to-end tests). Never in production.
 */
export function shouldIncludeDrafts(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.NODE_ENV !== "production" || env.MDC_INCLUDE_DRAFTS === "true";
}

/** Splits a file into its YAML front-matter and MDX body. */
function splitFrontmatter(raw: string): { yaml: string; body: string } | null {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) return null;
  return { yaml: match[1] ?? "", body: match[2] ?? "" };
}

/** True if the body has a `# ` heading outside code blocks. */
function hasLevelOneHeading(body: string): boolean {
  let inCode = false;
  for (const line of body.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) inCode = !inCode;
    if (!inCode && /^#\s/.test(line)) return true;
  }
  return false;
}

/**
 * Parses and validates one content file against `schema`. Returns the item, or
 * the list of problems found (each prefixed with the file name).
 */
export function parseContentFile<S extends z.ZodType>(
  fileName: string,
  raw: string,
  schema: S,
  options: ParseOptions<z.infer<S>> = {},
): { ok: true; item: ContentFile<z.infer<S>> } | { ok: false; problems: string[] } {
  const fail = (...problems: string[]) => ({
    ok: false as const,
    problems: problems.map((p) => `${fileName}: ${p}`),
  });

  const slug = fileName.replace(/\.mdx$/, "");
  if (!SLUG.test(slug)) {
    return fail("file name must be lowercase words joined by hyphens, e.g. my-guide.mdx");
  }

  const parts = splitFrontmatter(raw);
  if (!parts) return fail("missing front-matter block (the --- lines at the top of the file)");

  let data: unknown;
  try {
    data = parseYaml(parts.yaml);
  } catch (error) {
    return fail(`front-matter is not valid YAML: ${(error as Error).message}`);
  }

  const result = schema.safeParse(data);
  if (!result.success) {
    return fail(
      ...result.error.issues.map(
        (issue) => `${issue.path.join(".") || "front-matter"} ${issue.message}`,
      ),
    );
  }

  const { body } = parts;
  const item = { ...(result.data as object), slug, fileName, body } as ContentFile<z.infer<S>>;
  const problems: string[] = [];

  // Imports/exports would let a content file run arbitrary code; content files are text only.
  if (/^\s*(import|export)\s/m.test(body)) {
    problems.push("import/export statements are not allowed in content files");
  }
  if (hasLevelOneHeading(body)) {
    problems.push('do not use "# " headings; the page title comes from the front-matter');
  }
  problems.push(...(options.check?.(item, raw) ?? []));

  if (problems.length > 0) return fail(...problems);
  return { ok: true, item };
}

/**
 * Loads and validates every `.mdx` file in `dir`. Throws a ContentError listing
 * every problem if any file is invalid, which fails `next build`.
 */
export async function loadContentDir<S extends z.ZodType>(
  dir: string,
  schema: S,
  options: ParseOptions<z.infer<S>> = {},
): Promise<ContentFile<z.infer<S>>[]> {
  const fileNames = (await readdir(dir)).filter((name) => name.endsWith(".mdx")).sort();
  const items: ContentFile<z.infer<S>>[] = [];
  const problems: string[] = [];

  for (const fileName of fileNames) {
    const raw = await readFile(path.join(dir, fileName), "utf8");
    const result = parseContentFile(fileName, raw, schema, options);
    if (result.ok) items.push(result.item);
    else problems.push(...result.problems);
  }

  if (problems.length > 0) throw new ContentError(problems);
  return items;
}

/** Compiles an MDX body into a React component. Content comes only from this repository. */
export async function compileBody(body: string): Promise<MDXContent> {
  const { default: Content } = await evaluate(body, { ...runtime });
  return Content;
}
