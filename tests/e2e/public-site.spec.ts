import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

test("homepage follows the tech-decision design and fits the viewport", async ({
  page,
}) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Your CTO bestie."
  )
  await expect(page.locator(".hero-note")).toHaveText(
    "25 years of watching software break, so yours doesn’t."
  )
  await expect(page.locator(".hero-support")).toHaveText(
    "Clear answers for your biggest tech decisions."
  )
  await expect(page.locator(".building-card")).toContainText(
    "Building practical AI tools and helping people across industries make confident tech decisions. No jargon, no guesswork."
  )
  await expect(page.locator(".credibility strong")).toHaveText([
    "25 years",
    "Multi-startup",
    "AI strategy",
    "University of Michigan",
  ])
  await expect(
    page.getByText("you’re in good company", { exact: true })
  ).toHaveCSS("color", "rgb(217, 76, 131)")
  await expect(
    page.locator(".audience-grid .card > div:first-child > .eyebrow")
  ).toHaveText([
    "Non-technical founders",
    "Small businesses",
    "Startup teams",
    "Solo founders",
  ])
  await expect(page.locator(".audience-next-step")).toContainText(
    "Make your next hire or handoff with a practical plan"
  )
  await expect(page.locator(".translator .handwriting")).toHaveText(
    "bookmark this for your next dev meeting"
  )
  await expect(page.locator(".consulting-strip strong")).toHaveText(
    "Independent, on purpose."
  )
  await expect(page.locator(".consulting-strip .handwriting")).toHaveText(
    "no upsell. pinky promise."
  )
  await expect(
    page.getByRole("heading", {
      name: /big tech decisions, and nobody senior to ask/i,
    })
  ).toBeVisible()
  await expect(
    page.getByRole("heading", { name: /what they said, and what they meant/i })
  ).toBeVisible()
  await expect(
    page.getByRole("heading", {
      name: "Leave with your one-page AI plan.",
    })
  ).toBeVisible()
  await expect(
    page.getByRole("heading", { name: /real questions, straight answers/i })
  ).toBeVisible()
  await expect(
    page.getByRole("heading", { name: /25 years across/i })
  ).toBeVisible()
  await expect(page.locator(".story-section .tags")).toContainText(
    "Non-technical founders"
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

test("starter kit uses faint graph paper and a readable post-it checklist", async ({
  page,
}) => {
  await page.goto("/")
  await expect(page.locator(".kit-band")).toHaveCSS(
    "background-size",
    "25px 25px, 25px 25px"
  )
  await expect(page.locator(".kit-band")).toHaveCSS("color", "rgb(13, 27, 42)")
  await expect(page.locator(".kit-band")).toHaveCSS(
    "background-image",
    "linear-gradient(rgba(237, 203, 177, 0.2) 1px, rgba(0, 0, 0, 0) 1px), linear-gradient(90deg, rgba(237, 203, 177, 0.2) 1px, rgba(0, 0, 0, 0) 1px)"
  )
  await expect(page.locator(".worksheet")).toHaveCSS(
    "background-color",
    "rgb(255, 242, 168)"
  )
  await expect(page.locator(".worksheet")).toHaveCSS("border-top-width", "0px")
  await expect(page.locator(".worksheet")).toHaveCSS(
    "border-radius",
    "2px 2px 12px"
  )
  await expect(page.locator(".worksheet")).toHaveCSS(
    "background-image",
    "linear-gradient(rgba(228, 207, 114, 0.2) 40px, rgba(0, 0, 0, 0) 40px)"
  )
  await expect(page.locator(".worksheet .eyebrow")).toHaveText(
    "The Sara Test · Before you sign up"
  )
  await expect(page.locator(".worksheet .worksheet-row")).toHaveText([
    "Where does my stuff go?",
    "Who else can get in?",
    "Can I break up with it?",
  ])
  await expect(page.locator(".kit-section .check-list strong")).toHaveText([
    "A one-hour worksheet",
    "The Sara Test",
    "A “Safe to start” one-pager",
  ])
})

test("homepage kit card matches the kit on /newsletter", async ({ page }) => {
  const kitItems = [
    "A one-hour worksheet that ends with your one-page AI plan",
    "The Sara Test, so you can judge any AI tool yourself",
    "A “Safe to start” one-pager: what never to paste into AI, which settings to turn off, how to spot a trustworthy tool",
  ]
  await page.goto("/")
  const card = page.locator(".offerings .card.featured")
  await expect(card.locator("h3")).toHaveText("The Free CTO Starter Kit")
  await expect(card.locator("h3 + p")).toHaveText(
    "One hour, one busywork task, one plan you can actually use."
  )
  await expect(card.locator(".check-list li")).toHaveText(kitItems)
  await expect(card.getByRole("link", { name: /Get the kit/ })).toHaveAttribute(
    "href",
    "/newsletter"
  )
  await expect(page.locator("body")).not.toContainText(/10 tech decisions/i)

  await page.goto("/newsletter")
  await expect(
    page.locator(".page-newsletter .check-list").first().locator("li")
  ).toHaveText(kitItems)
  await expect(page.locator("body")).not.toContainText(/10 tech decisions/i)
})

test("homepage passes automated WCAG checks", async ({ page }) => {
  await page.goto("/")
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze()
  expect(results.violations).toEqual([])
})

test("hero has compact spacing and top-aligned desktop columns", async ({
  page,
}) => {
  await page.goto("/")
  await page.evaluate(() => document.fonts.ready)
  for (const width of [800, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 })
    const copy = await page.locator(".hero-copy").boundingBox()
    const heading = await page.locator(".hero h1").boundingBox()
    const portrait = await page.locator(".hero-visual .portrait").boundingBox()
    const visual = await page.locator(".hero-visual").boundingBox()
    expect(copy).not.toBeNull()
    expect(heading).not.toBeNull()
    expect(portrait).not.toBeNull()
    expect(visual).not.toBeNull()
    expect(Math.abs(copy!.y - portrait!.y)).toBeLessThanOrEqual(1)
    expect(Math.abs(heading!.y - portrait!.y)).toBeLessThanOrEqual(1)
    expect(Math.abs(copy!.height - visual!.height)).toBeLessThanOrEqual(1)
    await expect(page.locator(".hero-visual .portrait")).toHaveCSS(
      "object-position",
      "50% 0%"
    )
    await expect(page.locator(".building-card > p:last-child")).toHaveCSS(
      "font-weight",
      "400"
    )
    await expect(page.locator(".hero")).toHaveCSS("padding-top", "48px")
    await expect(page.locator(".hero-note")).toHaveCSS("margin-bottom", "16px")
  }
  await page.setViewportSize({ width: 390, height: 844 })
  const copy = await page.locator(".hero-copy").boundingBox()
  const portrait = await page.locator(".hero-visual .portrait").boundingBox()
  expect(copy).not.toBeNull()
  expect(portrait).not.toBeNull()
  expect(portrait!.y).toBeGreaterThanOrEqual(copy!.y + copy!.height + 39)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    )
  ).toBe(false)
})

test("hero email label is visually hidden but remains accessible", async ({
  page,
}) => {
  await page.goto("/")
  const hero = page.locator(".hero-signup")
  await expect(
    hero.getByRole("textbox", { name: "Email address" })
  ).toBeVisible()
  await expect(hero.locator(".signup-form > label:first-child")).toHaveCSS(
    "clip-path",
    "inset(50%)"
  )
  for (const label of await page
    .locator(".signup-form > label:first-child")
    .all()) {
    if (
      !(await label.evaluate((element) => Boolean(element.closest(".hero"))))
    ) {
      await expect(label).toHaveCSS("clip-path", "none")
    }
  }
})

test("signup consent checkboxes align with their text", async ({ page }) => {
  await page.goto("/")
  for (const consent of await page.locator(".consent").all()) {
    const checkbox = await consent
      .locator('input[type="checkbox"]')
      .boundingBox()
    const text = await consent.locator("span").boundingBox()
    expect(checkbox).not.toBeNull()
    expect(text).not.toBeNull()
    expect(
      Math.abs(
        checkbox!.y + checkbox!.height / 2 - (text!.y + text!.height / 2)
      )
    ).toBeLessThanOrEqual(1)
    await expect(consent.locator("a")).toHaveCSS("display", "inline")
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    )
  ).toBe(false)
})

test("experience uses industry pills and text-only venture cards", async ({
  page,
}) => {
  await page.goto("/")
  for (const name of ["Rise & Shore", "TaxDedux"]) {
    const card = page.locator("article").filter({
      has: page.getByRole("heading", { name, exact: true }),
    })
    await expect(card).toBeVisible()
    await expect(card.locator(".venture-logo, img")).toHaveCount(0)
  }
  for (const pill of await page.locator(".experience .tags span").all()) {
    await expect(pill).toHaveCSS("border-radius", "999px")
    await expect(pill).toHaveCSS("font-weight", "800")
  }
  await expect(page.locator(".experience .expertise-list")).toHaveText(
    "AI strategy · Development · Architecture design and reviews · Engineering leadership · Teaching"
  )
  await expect(page.locator(".experience .handwriting")).toHaveText(
    "I make the same calls I help you make"
  )
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    )
  ).toBe(false)
})

test("tech translator features a different AI phrase on each visit", async ({
  page,
}) => {
  await page.goto("/")
  const phrase = page.locator(".translator-spotlight h3")
  const seen = new Set<string>()
  for (let visit = 0; visit < 4; visit += 1) {
    if (visit > 0) await page.reload()
    await expect
      .poll(() =>
        page.evaluate(() => localStorage.getItem("translator-phrase"))
      )
      .toBe(String(visit))
    await page.waitForFunction(
      (known) =>
        !known.includes(
          document.querySelector(".translator-spotlight h3")?.textContent ?? ""
        ),
      [...seen]
    )
    seen.add((await phrase.textContent()) ?? "")
  }
  expect(seen.size).toBe(4)
})

test("bestie voice appears on the interior pages it belongs to", async ({
  page,
}) => {
  await page.goto("/build-with-me")
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Send it to your CTO bestie."
  )
  await expect(page.locator(".page-intro .lead")).toContainText(
    "25 years of watching software break, so yours doesn’t."
  )
  await page.goto("/about")
  await expect(page.locator(".about-story")).toContainText("your CTO bestie")
  await page.goto("/resources")
  await expect(page.locator("main")).toContainText(
    "The library is on the workbench."
  )
  await page.goto("/newsletter")
  await expect(
    page.getByRole("heading", { name: "Margin Notes" })
  ).toBeVisible()
  await expect(page.locator("main .handwriting")).toHaveText(
    "xo, your CTO bestie"
  )
  await expect(page.locator(".footer-signoff")).toHaveText(
    "xo, your CTO bestie"
  )
  await page.goto("/a-page-that-does-not-exist")
  await expect(page.locator("main")).toContainText(
    "Bestie, this page broke. Ironic, I know."
  )
})

test("picks pages pass automated WCAG checks", async ({ page }) => {
  for (const route of [
    "/picks",
    "/picks/breakup-pile",
    "/picks/sample-inbox-tidy",
  ]) {
    await page.goto(route)
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze()
    expect(results.violations, route).toEqual([])
  }
})

test("bio and footer do not display signature artwork", async ({ page }) => {
  await page.goto("/")
  await expect(page.locator(".bio-signature, .footer-signature")).toHaveCount(0)
  await expect(page.getByRole("img", { name: "Sara’s signature" })).toHaveCount(
    0
  )
})

test("closing signup is an inset rounded card", async ({ page }) => {
  await page.goto("/")
  const card = page.locator(".closing-band")
  await expect(card).toHaveCSS("border-radius", "24px")
  const bounds = await card.boundingBox()
  expect(bounds).not.toBeNull()
  const viewportWidth = await page.evaluate(() => window.innerWidth)
  expect(bounds!.x).toBeGreaterThanOrEqual(24)
  expect(viewportWidth - bounds!.x - bounds!.width).toBeGreaterThanOrEqual(24)
  expect(
    await card.evaluate((element) => element.scrollWidth > element.clientWidth)
  ).toBe(false)
})

test("signup notices remain readable inside the sand closing band", async ({
  page,
}) => {
  await page.goto("/")
  // Swap the form only after React hydrates it, or React re-renders the
  // form over the injected notice.
  await page.waitForFunction(() => {
    const form = document.querySelector(".closing-band .signup-form")
    return Boolean(
      form && Object.keys(form).some((key) => key.startsWith("__react"))
    )
  })
  await page.locator(".closing-band .signup-form").evaluate((form) => {
    const notice = document.createElement("p")
    notice.className = "notice small"
    notice.textContent = "Almost ready. I’m still testing the pipes."
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

test("headings use one line when they fit and wrap on small screens", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto("/")
  await page.evaluate(() => document.fonts.ready)
  await expect(page.locator("h1 br, h2 br, h3 br, h4 br")).toHaveCount(0)
  const heading = page.getByRole("heading", {
    name: "Real questions, straight answers.",
    exact: true,
  })
  const lineCount = () =>
    heading.evaluate((element) => {
      const style = getComputedStyle(element)
      return (
        element.getBoundingClientRect().height / parseFloat(style.lineHeight)
      )
    })
  expect(await lineCount()).toBeCloseTo(1, 1)
  await page.setViewportSize({ width: 390, height: 844 })
  expect(await lineCount()).toBeGreaterThan(1.5)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    )
  ).toBe(false)
})

test("public routes, retirement responses, and unknown routes work", async ({
  page,
}) => {
  for (const route of [
    "/start-here",
    "/about",
    "/now",
    "/resources",
    "/picks",
    "/picks/breakup-pile",
    "/course",
    "/community",
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
    await expect(
      page.getByRole("heading", { name: "This page has been retired." })
    ).toBeVisible()
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

test("the public bundle excludes legacy assets and cannot expose subscriber records", async ({
  request,
}) => {
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
          ? {
              error:
                "Email service is temporarily unavailable. Please try again.",
            }
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
  await expect(
    page.getByText(
      "Email service is temporarily unavailable. Please try again."
    )
  ).toBeVisible()
  await form.getByRole("button", { name: /send me the kit/i }).click()
  await expect(
    page.getByText("Check your inbox to confirm your request.")
  ).toBeVisible()
  expect(attempts).toBe(2)
})

test("the kit form collects optional answers and keeps consent separate", async ({
  page,
}) => {
  let body: Record<string, unknown> = {}
  await page.route("**/api/newsletter", async (route) => {
    body = route.request().postDataJSON()
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        message: "You’re in, bestie. Check your inbox soon.",
      }),
    })
  })
  await page.goto("/newsletter")
  const form = page.locator(".kit-form")
  const consent = form.getByLabel(
    "Also send me Margin Notes, my newsletter. Unsubscribe anytime."
  )
  await expect(consent).not.toBeChecked()
  await expect(
    form.getByRole("link", { name: "How I handle your info" })
  ).toHaveAttribute("href", "/privacy")

  const business = form.getByLabel(
    "What kind of business do you run? (optional)"
  )
  await expect(business.locator("option")).toHaveText([
    "Choose one",
    "Service business",
    "Retail or e-commerce",
    "Agency or freelancer",
    "Startup or tech product",
    "Restaurant or hospitality",
    "Nonprofit",
    "Other",
  ])
  const other = form.getByLabel("Tell me a little more (optional)")
  await expect(other).toHaveCount(0)

  // Email is required and validated before anything is sent.
  await form.getByRole("button", { name: "Send me the kit" }).click()
  expect(
    await form
      .getByLabel("Email address")
      .evaluate((input: HTMLInputElement) => input.validity.valueMissing)
  ).toBe(true)
  await form.getByLabel("Email address").fill("not-an-email")
  await form.getByRole("button", { name: "Send me the kit" }).click()
  expect(
    await form
      .getByLabel("Email address")
      .evaluate((input: HTMLInputElement) => input.validity.typeMismatch)
  ).toBe(true)
  expect(body).toEqual({})

  // Keyboard only from here.
  await form.getByLabel("Email address").fill("reader@example.com")
  await page.keyboard.press("Tab")
  await expect(form.getByLabel("First name (optional)")).toBeFocused()
  await page.keyboard.type("Ada")
  await page.keyboard.press("Tab")
  await expect(business).toBeFocused()
  await business.selectOption("other")
  await expect(other).toBeVisible()
  await page.keyboard.press("Tab")
  await expect(other).toBeFocused()
  await page.keyboard.type("Bike repair co-op")
  await page.keyboard.press("Tab")
  await expect(consent).toBeFocused()
  await page.keyboard.press("Enter")

  await expect(form.getByRole("status")).toHaveText(
    "You’re in, bestie. Check your inbox soon."
  )
  expect(body).toMatchObject({
    email: "reader@example.com",
    marketingConsent: false,
    interest: "kit",
    source: "newsletter",
    sourcePage: "/newsletter",
    firstName: "Ada",
    businessType: "other",
    businessTypeOther: "Bike repair co-op",
    website: "",
  })
  await expect(other).toHaveCount(0)

  const results = await new AxeBuilder({ page })
    .include(".kit-form")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze()
  expect(results.violations).toEqual([])
})

test("picks show badges, filters, details, and the Breakup Pile", async ({
  page,
}) => {
  // SITE_PREVIEW has no database, so it shows the two sample picks.
  await page.goto("/picks")
  await expect(page.locator(".site-footer")).toContainText("Picks")
  await expect(page.locator(".site-footer")).not.toContainText("Picks (soon)")
  const card = page.locator(".pick-card", { hasText: "Sample: Inbox Tidy" })
  await expect(card.locator(".pick-badge")).toHaveText(
    "Bestie-approved · last checked Nov 2026"
  )
  await expect(card.locator(".pick-note")).toHaveText("i’d start here")
  await expect(card.locator(".pick-note")).toHaveCSS(
    "font-family",
    /Caveat|caveat/
  )
  await expect(
    page.locator(".pick-card", { hasText: "Forever Notes" })
  ).toHaveCount(0)

  await page.getByRole("link", { name: "Breakup Pile", exact: true }).click()
  await expect(page).toHaveURL(/status=breakup/)
  await expect(page.locator(".pick-card")).toHaveText([/Forever Notes/])
  await page.getByRole("link", { name: "Grow without the hype" }).click()
  await expect(page).toHaveURL(/pillar=grow/)
  await expect(page.locator(".pick-card")).toHaveCount(0)
  await expect(page.getByText("No picks match those filters.")).toBeVisible()

  await page.goto("/picks")
  await page.getByRole("link", { name: "Sample: Inbox Tidy" }).click()
  await expect(page).toHaveURL("/picks/sample-inbox-tidy")
  await expect(page.locator(".pick-answers li")).toHaveCount(6)
  await expect(page.locator(".pick-answers")).toContainText(
    "Yes. One click to export"
  )
  const website = page.getByRole("link", { name: "example.com" })
  await expect(website).toHaveAttribute(
    "href",
    "https://example.com/inbox-tidy"
  )

  await page.goto("/picks/breakup-pile")
  await expect(page.locator(".page-intro")).toContainText(
    "As your bestie, I can’t let you stay with these."
  )
  const retired = page.locator(".pick-card")
  await expect(retired.locator(".pick-badge")).toHaveText(
    "Breakup Pile · last checked Jul 2026"
  )
  await expect(retired.locator(".pick-recheck")).toHaveText(
    "Due for a re-check"
  )
  await expect(retired).toContainText("Why we broke up: Exports went away")
  const letter = page.locator(".breakup-letter-body")
  await expect(letter).toBeHidden()
  await page.getByText("Read the breakup letter").click()
  await expect(letter).toContainText("I’m keeping the free trial hoodie.")

  expect((await page.goto("/picks/not-a-real-pick"))?.status()).toBe(404)
})
