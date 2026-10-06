import { evaluate } from "@mdx-js/mdx";
import type { MDXContent } from "mdx/types";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import * as runtime from "react/jsx-runtime";
import { parse as parseYaml } from "yaml";
import { frontmatterSchema, type ConditionFrontmatter } from "./schema";
import { BODY_SECTIONS, EMERGENCY_COMPONENT, EMERGENCY_SECTION } from "./sections";

export const CONTENT_DIR = path.join(process.cwd(), "content", "conditions");

const PLACEHOLDER = "TODO(content)";

export type Condition = ConditionFrontmatter & {
  /** File name the condition came from, for error messages. */
  fileName: string;
  /** Raw MDX body (everything after the front-matter). */
  body: string;
};

/** Thrown when one or more content files are invalid. Lists every problem at once. */
export class ContentError extends Error {
  constructor(readonly problems: string[]) {
    super(`Invalid content in content/conditions:\n${problems.map((p) => `  - ${p}`).join("\n")}`);
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

/** Returns the text of every `## ` heading in the body, in order (ignores code blocks). */
function bodyHeadings(body: string): { level: number; text: string }[] {
  const headings: { level: number; text: string }[] = [];
  let inCode = false;
  for (const line of body.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) inCode = !inCode;
    if (inCode) continue;
    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (match) headings.push({ level: match[1]!.length, text: match[2]! });
  }
  return headings;
}

/** Returns the body text between `## <heading>` and the next `## ` heading. */
function sectionText(body: string, heading: string): string {
  const lines = body.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (start === -1) return "";
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => /^##\s/.test(line));
  return (end === -1 ? rest : rest.slice(0, end)).join("\n");
}

/**
 * Parses and validates one condition file. Returns the condition, or the list
 * of problems found (each prefixed with the file name).
 */
export function parseConditionFile(
  fileName: string,
  raw: string,
): { ok: true; condition: Condition } | { ok: false; problems: string[] } {
  const fail = (...problems: string[]) => ({
    ok: false as const,
    problems: problems.map((p) => `${fileName}: ${p}`),
  });

  const parts = splitFrontmatter(raw);
  if (!parts) return fail("missing front-matter block (the --- lines at the top of the file)");

  let data: unknown;
  try {
    data = parseYaml(parts.yaml);
  } catch (error) {
    return fail(`front-matter is not valid YAML: ${(error as Error).message}`);
  }

  const result = frontmatterSchema.safeParse(data);
  if (!result.success) {
    return fail(
      ...result.error.issues.map(
        (issue) => `${issue.path.join(".") || "front-matter"} ${issue.message}`,
      ),
    );
  }

  const meta = result.data;
  const { body } = parts;
  const problems: string[] = [];

  const expectedFileName = `${meta.slug}.mdx`;
  if (fileName !== expectedFileName) {
    problems.push(
      `slug "${meta.slug}" does not match the file name (expected ${expectedFileName})`,
    );
  }

  // Imports/exports would let a content file run arbitrary code; content files are text only.
  if (/^\s*(import|export)\s/m.test(body)) {
    problems.push("import/export statements are not allowed in content files");
  }

  const headings = bodyHeadings(body);
  if (headings.some((h) => h.level === 1)) {
    problems.push('do not use "# " headings; the page title comes from the front-matter');
  }
  const sections = headings.filter((h) => h.level === 2).map((h) => h.text);
  if (sections.join("\n") !== BODY_SECTIONS.join("\n")) {
    problems.push(
      `body "## " headings must be exactly, in order: ${BODY_SECTIONS.join(" | ")}. Found: ${sections.join(" | ") || "(none)"}`,
    );
  }

  if (!new RegExp(`<${EMERGENCY_COMPONENT}\\s*/>`).test(sectionText(body, EMERGENCY_SECTION))) {
    problems.push(
      `the "${EMERGENCY_SECTION}" section must include <${EMERGENCY_COMPONENT} /> (emergency wording comes from the region config)`,
    );
  }

  if (meta.status === "published" && raw.includes(PLACEHOLDER)) {
    problems.push(`a published page must not contain ${PLACEHOLDER} placeholders`);
  }

  if (problems.length > 0) return fail(...problems);
  return { ok: true, condition: { ...meta, fileName, body } };
}

/**
 * Loads and validates every condition file in `dir`. Throws a ContentError listing
 * every problem if any file is invalid — drafts included — which fails `next build`.
 */
export async function loadAllConditions(dir: string = CONTENT_DIR): Promise<Condition[]> {
  const fileNames = (await readdir(dir)).filter((name) => name.endsWith(".mdx")).sort();
  const conditions: Condition[] = [];
  const problems: string[] = [];
  const slugs = new Map<string, string>();

  for (const fileName of fileNames) {
    const raw = await readFile(path.join(dir, fileName), "utf8");
    const result = parseConditionFile(fileName, raw);
    if (!result.ok) {
      problems.push(...result.problems);
      continue;
    }
    const clash = slugs.get(result.condition.slug);
    if (clash)
      problems.push(`${fileName}: slug "${result.condition.slug}" is also used by ${clash}`);
    slugs.set(result.condition.slug, fileName);
    conditions.push(result.condition);
  }

  if (problems.length > 0) throw new ContentError(problems);
  return conditions;
}

/** Conditions that may be shown on this build (published, plus drafts when allowed). */
export async function getVisibleConditions(dir: string = CONTENT_DIR): Promise<Condition[]> {
  const includeDrafts = shouldIncludeDrafts();
  return (await loadAllConditions(dir)).filter(
    (condition) => condition.status === "published" || includeDrafts,
  );
}

export async function getCondition(slug: string, dir: string = CONTENT_DIR) {
  return (await getVisibleConditions(dir)).find((condition) => condition.slug === slug);
}

/** Compiles an MDX body into a React component. Content comes only from this repository. */
export async function compileBody(body: string): Promise<MDXContent> {
  const { default: Content } = await evaluate(body, { ...runtime });
  return Content;
}
