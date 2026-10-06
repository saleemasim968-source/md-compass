import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

// The e2e build sets MDC_INCLUDE_DRAFTS=true so the placeholder condition can be tested.
const PAGES = [
  { name: "home page", path: "/" },
  { name: "condition page (placeholder draft)", path: "/conditions/placeholder-condition" },
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
