import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
  ],
  // Tests run against a production build, which is what users get. Drafts are included
  // (MDC_INCLUDE_DRAFTS) so draft content can be tested; a fresh build is
  // always made so a stale server without drafts is never reused.
  webServer: {
    command: `npm run build && npm run start -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    env: { MDC_INCLUDE_DRAFTS: "true" },
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
