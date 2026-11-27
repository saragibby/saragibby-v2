import { describe, expect, it } from "vitest"
import {
  isDueForRecheck,
  lastCheckedLabel,
  pickUrlProblem,
  splitPicks,
  type PickData,
} from "../../src/lib/site/picks"
import { samplePicks } from "../../src/lib/site/sample-picks"

const base = samplePicks[0]

describe("picks", () => {
  it("formats the last-checked date without shifting months", () => {
    expect(lastCheckedLabel("2026-11-01")).toBe("Nov 2026")
    expect(lastCheckedLabel("2026-11-01T00:00:00.000Z")).toBe("Nov 2026")
  })

  it("flags a pick once its last check is more than 90 days old", () => {
    const now = new Date("2026-11-27T12:00:00Z")
    expect(isDueForRecheck("2026-08-29T00:00:00.000Z", now)).toBe(false)
    expect(isDueForRecheck("2026-08-28T00:00:00.000Z", now)).toBe(true)
  })

  it("only accepts plain links with no affiliate or tracking parameters", () => {
    expect(pickUrlProblem("https://example.com/tool")).toBeNull()
    expect(pickUrlProblem("https://example.com/tool#pricing")).toBeNull()
    for (const url of [
      "https://example.com/?ref=sara",
      "https://example.com/?utm_source=saragibby",
      "https://example.com/?via=sara",
      "https://example.com/?",
      "javascript:alert(1)",
      "https://user:pass@example.com/",
      "example.com",
    ]) {
      expect(pickUrlProblem(url), url).not.toBeNull()
    }
  })

  it("moves breakups to their own list, newest check first", () => {
    const all: PickData[] = [
      { ...base, slug: "a", lastChecked: "2026-09-01", status: "approved" },
      { ...base, slug: "b", lastChecked: "2026-11-01", status: "changed" },
      {
        ...base,
        slug: "c",
        lastChecked: "2026-10-01",
        status: "breakup",
        breakupNote: "Exports.",
      },
    ]
    const { current, retired } = splitPicks(all)
    expect(current.map((pick) => pick.slug)).toEqual(["b", "a"])
    expect(retired.map((pick) => pick.slug)).toEqual(["c"])
  })

  it("keeps the sample picks unpublished and valid", () => {
    expect(samplePicks).toHaveLength(2)
    for (const pick of samplePicks) {
      expect(pick.published).toBe(false)
      expect(pick.name).toMatch(/^Sample: /)
      expect(pickUrlProblem(pick.url)).toBeNull()
      if (pick.status === "breakup") expect(pick.breakupNote).toBeTruthy()
    }
  })
})
