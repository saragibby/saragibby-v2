import { defineConfig, devices } from "@playwright/test"

const port = Number(process.env.E2E_PORT || 3100)

export default defineConfig({
  testDir: "./tests/e2e",
  use: { baseURL: `http://localhost:${port}`, trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
  ],
  webServer: {
    command: `npm run dev -- --port ${port}`,
    url: `http://localhost:${port}`,
    env: { SITE_PREVIEW: "true" },
    reuseExistingServer: false,
    timeout: 180_000,
  },
})
