import "server-only"
import { cache } from "react"
import type { PickData } from "./picks"
import { samplePicks } from "./sample-picks"

export type RecordValue = Record<string, unknown>
export function record(value: unknown): RecordValue {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as RecordValue)
    : {}
}
export function text(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value : fallback
}
export function items(value: unknown): RecordValue[] {
  return Array.isArray(value) ? value.map(record) : []
}

export const preview = process.env.SITE_PREVIEW === "true"
export const configured = Boolean(
  process.env.DATABASE_URL && process.env.PAYLOAD_SECRET
)

async function cms() {
  if (!configured) {
    throw new Error(
      "DATABASE_URL and PAYLOAD_SECRET are required outside SITE_PREVIEW=true."
    )
  }
  const [{ getPayload }, { default: config }] = await Promise.all([
    import("payload"),
    import("@payload-config"),
  ])
  return getPayload({ config })
}

export async function getGlobal(slug: "starterKit") {
  if (preview) return {}
  const payload = await cms()
  return record(
    await payload.findGlobal({ slug, overrideAccess: false, depth: 1 })
  )
}

export async function getDocuments(
  collection: "resources" | "pages" | "offerings"
) {
  if (preview) return []
  const payload = await cms()
  const result = await payload.find({
    collection,
    overrideAccess: false,
    where: { _status: { equals: "published" } },
    limit: 100,
    depth: 1,
    ...(collection === "resources" ? { sort: "-publishedAt" } : {}),
  })
  return items(result.docs)
}

export async function getPage(slug: string) {
  return getDocument("pages", slug)
}

export const getDocument = cache(async function getDocument(
  collection: "resources" | "pages" | "offerings",
  slug: string
) {
  if (preview) return undefined
  const payload = await cms()
  const result = await payload.find({
    collection,
    overrideAccess: false,
    where: {
      and: [{ _status: { equals: "published" } }, { slug: { equals: slug } }],
    },
    limit: 1,
    depth: 1,
  })

  return items(result.docs)[0]
})

export async function getSitemapDocuments(collection: "resources" | "pages") {
  if (preview) return []
  const payload = await cms()
  const documents: RecordValue[] = []
  let page = 1
  let hasNextPage = true
  while (hasNextPage) {
    const result = await payload.find({
      collection,
      overrideAccess: false,
      where: { _status: { equals: "published" } },
      page,
      limit: 100,
      depth: 0,
      sort: "id",
    })
    documents.push(...items(result.docs))
    hasNextPage = result.hasNextPage
    page += 1
  }
  return documents
}

// Picks use a `published` checkbox rather than drafts. Visitors can only
// read published picks (see collections/Picks.ts); the filter is repeated
// here so these loaders never depend on that alone. SITE_PREVIEW has no
// database, so it shows the sample picks instead.
export async function getPublishedPicks(): Promise<PickData[]> {
  if (preview) return samplePicks
  const payload = await cms()
  const result = await payload.find({
    collection: "picks",
    overrideAccess: false,
    where: { published: { equals: true } },
    sort: "-lastChecked",
    limit: 200,
    depth: 0,
  })
  return result.docs
}

export const getPublishedPick = cache(async function getPublishedPick(
  slug: string
): Promise<PickData | undefined> {
  if (preview) return samplePicks.find((pick) => pick.slug === slug)
  const payload = await cms()
  const result = await payload.find({
    collection: "picks",
    overrideAccess: false,
    where: {
      and: [{ published: { equals: true } }, { slug: { equals: slug } }],
    },
    limit: 1,
    depth: 0,
  })
  return result.docs[0]
})

export async function hasPublishedPicks(): Promise<boolean> {
  if (preview) return samplePicks.length > 0
  const payload = await cms()
  const { totalDocs } = await payload.count({
    collection: "picks",
    overrideAccess: false,
    where: { published: { equals: true } },
  })
  return totalDocs > 0
}

export function safeHref(value: unknown): string | undefined {
  const url = text(value)
  return /^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(url) ? url : undefined
}

export function resourceType(resource: RecordValue) {
  return text(resource.resourceType, "Resource")
}
