import { describe, expect, it } from "vitest"
import { lastCheckedLabel, splitPicks, type Pick } from "../../src/lib/site/picks"

const base = { name: "Example", url: "https://example.com", summary: "Example." }

describe("picks", () => {
  it("formats the last-checked date without shifting months", () => {
    expect(lastCheckedLabel("2026-11-01")).toBe("Nov 2026")
  })

  it("moves breakups to their own list, newest check first", () => {
    const all: Pick[] = [
      { ...base, lastChecked: "2026-09-01", status: "approved" },
      { ...base, lastChecked: "2026-11-01", status: "changed", whatChanged: "Price." },
      { ...base, lastChecked: "2026-10-01", status: "breakup", whyWeBrokeUp: "Exports." },
    ]
    const { current, retired } = splitPicks(all)
    expect(current.map((pick) => pick.status)).toEqual(["changed", "approved"])
    expect(retired.map((pick) => pick.status)).toEqual(["breakup"])
  })
})
