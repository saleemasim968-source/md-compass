import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

// The e2e build sets MDC_INCLUDE_DRAFTS=true so the placeholder condition can be tested.
const PAGES = [
  { name: "home page", path: "/" },
  { name: "condition page (placeholder draft)", path: "/conditions/placeholder-condition" },
  { name: "condition index", path: "/conditions" },
  { name: "about page", path: "/about" },
];

for (const { name, path } of PAGES) {
  test.describe(name, () => {
    test("has no automatically detectable accessibility violations", async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
      expect(results.violations).toEqual([]);
    });

    test("skip link is the first focusable element and moves focus to main", async ({ page }) => {
      await page.goto(path);
      await page.keyboard.press("Tab");
      const skip = page.getByRole("link", { name: "Skip to main content" });
      await expect(skip).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page.locator("#main-content")).toBeFocused();
    });

    test("does not scroll horizontally at 320px wide (WCAG 1.4.10)", async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 640 });
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect(overflow).toBe(false);
    });
  });
}

test.describe("condition page template", () => {
  test("shows every section from CONTENT_GUIDELINES.md in order", async ({ page }) => {
    await page.goto("/conditions/placeholder-condition");
    const h2s = await page.locator("main h2").allTextContents();
    expect(h2s).toEqual([
      expect.stringMatching(/safety notice/i),
      "What it is",
      "Common signs",
      "When to get help",
      "How it is usually diagnosed",
      "How it is usually treated or managed",
      "Living with it",
      "Sources",
      "Review information",
    ]);
    await expect(page.getByRole("note", { name: /emergency box heading/i })).toBeVisible();
    await expect(page.getByText("Draft: not clinically reviewed")).toBeVisible();
  });

  test("drafts are not indexed by search engines", async ({ page }) => {
    await page.goto("/conditions/placeholder-condition");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("unknown condition returns 404", async ({ page }) => {
    const response = await page.goto("/conditions/does-not-exist");
    expect(response?.status()).toBe(404);
  });
});

test.describe("condition index and search", () => {
  test("lists the placeholder condition under its letter", async ({ page }) => {
    await page.goto("/conditions");
    await expect(page.getByRole("heading", { level: 1, name: "Conditions A to Z" })).toBeVisible();
    await page
      .getByRole("navigation", { name: "Jump to letter" })
      .getByRole("link", { name: "T" })
      .click();
    await expect(page).toHaveURL(/#letter-T$/);
    await page.getByRole("link", { name: "TODO(content): condition name" }).click();
    await expect(page).toHaveURL(/\/conditions\/placeholder-condition$/);
  });

  test("search works with the keyboard and announces results", async ({ page }) => {
    await page.goto("/conditions");
    const box = page.getByRole("searchbox", { name: "Search conditions" });
    await box.focus();
    await page.keyboard.type("other names for this");
    await expect(page.getByRole("status")).toHaveText("1 condition found.");
    await expect(page.getByText(/^Also called: /)).toBeVisible();

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    expect(results.violations).toEqual([]);

    await box.fill("no such thing");
    await expect(page.getByRole("status")).toHaveText("No conditions found.");
  });

  test("search sends no network requests", async ({ page }) => {
    await page.goto("/conditions");
    await page.waitForLoadState("networkidle");
    const requests: string[] = [];
    page.on("request", (request) => requests.push(request.url()));
    await page.getByRole("searchbox", { name: "Search conditions" }).fill("condition");
    await expect(page.getByRole("status")).toHaveText("1 condition found.");
    expect(requests).toEqual([]);
  });

  test("the A to Z list works without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/conditions");
    await expect(page.getByRole("link", { name: "TODO(content): condition name" })).toBeVisible();
    await expect(page.getByRole("searchbox")).toHaveCount(0);
    await context.close();
  });
});

test.describe("main navigation", () => {
  test("is reachable from every page and marks the current page", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });
    await nav.getByRole("link", { name: "Conditions A to Z" }).click();
    await expect(nav.getByRole("link", { name: "Conditions A to Z" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await nav.getByRole("link", { name: "About and sources" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "About MD Compass and our sources",
    );
    await expect(nav.getByRole("link", { name: "About and sources" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
