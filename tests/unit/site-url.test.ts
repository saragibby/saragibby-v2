import { afterEach, describe, expect, it, vi } from "vitest"
import { getSiteURL } from "../../src/lib/site-url"

afterEach(() => vi.unstubAllEnvs())

describe("site origin", () => {
  it("rejects mismatched frontend and email origins", () => {
    vi.stubEnv("SITE_URL", "https://saragibby.com")
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://different.example")
    expect(() => getSiteURL()).toThrow("same origin")
  })

  it("uses the canonical server origin when configured", () => {
    vi.stubEnv("SITE_URL", "https://saragibby.com")
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "")
    expect(getSiteURL().origin).toBe("https://saragibby.com")
  })
  it("uses localhost only in explicitly enabled preview mode", () => {
    vi.stubEnv("SITE_PREVIEW", "true")
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "")
    expect(getSiteURL().origin).toBe("http://localhost:3000")
  })

  it("requires a configured origin outside preview", () => {
    vi.stubEnv("SITE_PREVIEW", "false")
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "")
    expect(() => getSiteURL()).toThrow("must be configured")
  })

  it.each(["https://example.com/path", "https://user:pass@example.com", "https://example.com?token=secret", "ftp://example.com"])(
    "rejects a malformed canonical origin: %s",
    (origin) => {
      vi.stubEnv("NEXT_PUBLIC_SITE_URL", origin)
      expect(() => getSiteURL()).toThrow()
    }
  )

  it("requires HTTPS in production", () => {
    vi.stubEnv("NODE_ENV", "production")
    vi.stubEnv("SITE_PREVIEW", "false")
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://example.com")
    expect(() => getSiteURL()).toThrow("HTTPS")
  })
})
