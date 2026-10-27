import { describe, expect, it } from "vitest"
import { Homepage } from "../../src/globals/Homepage"
import { Pages } from "../../src/collections/Pages"

describe("public-site editor contract", () => {
  it("supports every full-mockup section in the owned editor", () => {
    const names = Homepage.fields.flatMap((field) => "name" in field ? [field.name] : [])
    expect(new Set(names).size).toBe(names.length)
    for (const name of [
      "hero", "story", "credibilityItems", "featuredResources", "offerings",
      "alwaysBuilding", "audienceHeading", "audienceItems", "offeringsHeading",
      "kitHeading", "kitContents", "audiences", "consultingDescription",
      "experienceHeading", "experienceDescription", "industries", "ventures",
      "closingHeading", "closingDescription",
    ]) expect(names).toContain(name)
  })

  it("requires explicit owner approval, independently of publication", () => {
    const approval = Pages.fields.find((field) => "name" in field && field.name === "ownerApproved")
    expect(approval).toMatchObject({ type: "checkbox", defaultValue: false })
    expect(approval && "access" in approval && approval.access).toHaveProperty("update")
  })
})
