import { describe, expect, it } from "vitest"
import { isRetiredPath } from "../../src/lib/legacy-routes"

describe("retired Gatsby URLs", () => {
  it.each(["/blog", "/eats/", "/brooklynn-karate/", "/recaps/7-03-20/", "/recaps/10-23-20"])(
    "retires the historical URL %s",
    (path) => expect(isRetiredPath(path)).toBe(true)
  )

  it.each(["/", "/resources", "/recaps/unknown", "/blog/new-post", "/eats-other"])(
    "does not misclassify another URL %s",
    (path) => expect(isRetiredPath(path)).toBe(false)
  )
})
