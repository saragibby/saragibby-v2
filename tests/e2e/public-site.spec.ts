import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

test("homepage follows the mockup and fits the viewport", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Build an AI-powered"
  )
  await expect(page.getByRole("heading", { name: /you don't need to quit/i })).toBeVisible()
  await expect(page.getByRole("heading", { name: /your first AI win/i })).toBeVisible()
  await expect(page.getByRole("heading", { name: /25 years across/i })).toBeVisible()
  await expect(page.locator(".story-section .tags")).toContainText(
    "Marketing tech and AI tooling"
  )
  await expect(page.locator(".story-section")).toContainText(
    "built and led engineering and product teams"
  )
  await expect(page.locator(".story-section")).not.toContainText("1994")
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth
  )
  expect(overflow).toBe(false)
})

test("homepage passes automated WCAG checks", async ({ page }) => {
  await page.goto("/")
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze()
  expect(results.violations).toEqual([])
})

test("venture cards display official logos without overflowing", async ({ page }) => {
  await page.goto("/")
  for (const name of ["Rise & Shore", "TaxDedux"]) {
    const card = page.locator("article").filter({
      has: page.getByRole("heading", { name, exact: true }),
    })
    const logo = card.locator(".venture-logo img")
    await logo.scrollIntoViewIfNeeded()
    await logo.evaluate((image: HTMLImageElement) => image.decode())
    expect(await logo.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
    await expect(logo).toHaveAttribute("alt", "")
    await expect(card.locator(".venture-logo")).toHaveCSS("background-color", "rgb(245, 239, 233)")
  }
  expect(await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth
  )).toBe(false)
})

test("signup notices remain readable inside the sand closing band", async ({ page }) => {
  await page.goto("/")
  await page.locator(".closing-band .signup-form").evaluate((form) => {
    const notice = document.createElement("p")
    notice.className = "notice small"
    notice.textContent = "Signup is not open yet. Email delivery is being connected."
    form.replaceWith(notice)
  })
  const notice = page.locator(".closing-band .notice")
  await expect(notice).toHaveCSS("color", "rgb(245, 239, 233)")
  await expect(notice).toHaveCSS("background-color", "rgb(23, 42, 59)")
  const results = await new AxeBuilder({ page })
    .include(".closing-band")
    .withRules(["color-contrast"])
    .analyze()
  expect(results.violations).toEqual([])
})

test("headings use one line when they fit and wrap on small screens", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto("/")
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator("h1 br, h2 br, h3 br, h4 br")).toHaveCount(0)
  const heading = page.getByRole("heading", {
    name: "Learn something useful in 15 minutes.",
    exact: true,
  })
  const lineCount = () => heading.evaluate((element) => {
    const style = getComputedStyle(element)
    return element.getBoundingClientRect().height / parseFloat(style.lineHeight)
  })
  expect(await lineCount()).toBeCloseTo(1, 1)
  await page.setViewportSize({ width: 390, height: 844 })
  expect(await lineCount()).toBeGreaterThan(1.5)
  expect(await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth
  )).toBe(false)
})

test("public routes, retirement responses, and unknown routes work", async ({ page }) => {
  for (const route of [
    "/start-here",
    "/about",
    "/now",
    "/resources",
    "/course",
    "/community",
    "/shop",
    "/build-with-me",
    "/newsletter",
    "/privacy",
    "/terms",
    "/disclaimer",
  ]) {
    const response = await page.goto(route)
    expect(response?.status(), route).toBe(200)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  }
  for (const route of ["/blog", "/eats", "/recaps/7-03-20/"]) {
    const response = await page.goto(route)
    expect(response?.status()).toBe(410)
    await expect(page.getByRole("heading", { name: "This page has been retired." })).toBeVisible()
  }
  const response = await page.goto("/a-page-that-does-not-exist")
  expect(response?.status()).toBe(404)
})

test("preview does not pretend a signup was delivered", async ({ page }) => {
  await page.goto("/")
  const response = await page.request.post("/api/newsletter", {
    data: {
      email: "test@example.com",
      marketingConsent: true,
      interest: "kit",
      source: "e2e",
      website: "",
    },
  })
  expect(response.ok()).toBe(false)
  expect(await response.json()).toHaveProperty("error")
})

test("draft previews cannot be indexed", async ({ request }) => {
  const response = await request.get("/robots.txt")
  expect(response.status()).toBe(200)
  expect(await response.text()).toContain("Disallow: /")
  const homepage = await request.get("/")
  expect(homepage.headers()["x-robots-tag"]).toBe("noindex, nofollow")
  const sitemap = await request.get("/sitemap.xml")
  expect(sitemap.status()).toBe(200)
  expect(await sitemap.text()).not.toContain("<loc>")
})

test("the public bundle excludes legacy assets and cannot expose subscriber records", async ({ request }) => {
  for (const route of [
    "/legacy/content/blog/recaps/7-03-20/index.md",
    "/sara.JPG",
    "/content/blog/brooklynn-karate/index.md",
  ]) {
    expect((await request.get(route)).status()).toBe(404)
  }
  const response = await request.get("/api/subscribers")
  expect(response.ok()).toBe(false)
})

test("signup surfaces server errors and permits a retry", async ({ page }) => {
  let attempts = 0
  await page.route("**/api/newsletter", async (route) => {
    attempts += 1
    await route.fulfill({
      status: attempts === 1 ? 503 : 200,
      contentType: "application/json",
      body: JSON.stringify(
        attempts === 1
          ? { error: "Email service is temporarily unavailable. Please try again." }
          : { message: "Check your inbox to confirm your request." }
      ),
    })
  })
  await page.goto("/")
  const form = page.locator("form").first()
  await form.locator('input[type="email"]').fill("reader@example.com")
  for (const checkbox of await form.locator('input[type="checkbox"]').all()) {
    await checkbox.check()
  }
  await form.getByRole("button", { name: /send me the kit/i }).click()
  await expect(page.getByText("Email service is temporarily unavailable. Please try again.")).toBeVisible()
  await form.getByRole("button", { name: /send me the kit/i }).click()
  await expect(page.getByText("Check your inbox to confirm your request.")).toBeVisible()
  expect(attempts).toBe(2)
})
