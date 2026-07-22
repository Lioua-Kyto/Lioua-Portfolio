import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    // Safari coverage: clip-path sweep + canvas DPR are the risk areas (§7).
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    // Always test the production bundle: `next dev` over a prod `.next`
    // serves stale chunks and silently breaks hydration (see DECISIONS.md).
    // CI builds as its own pipeline step; local runs build here.
    command: process.env.CI
      ? "npm run start"
      : "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
});
