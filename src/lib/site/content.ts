import "server-only"
import { cache } from "react"
import { biography } from "./biography"
import { homepageDesign } from "./homepage-design"

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

export async function getGlobal(slug: "site" | "homepage" | "starterKit") {
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

export const homeDraft = {
  eyebrow: homepageDesign.hero.eyebrow,
  title: homepageDesign.hero.heading,
  description: homepageDesign.hero.description,
  alwaysBuilding: homepageDesign.alwaysBuilding,
  story: biography[0],
  teaching: biography[1],
}

export function homeCopy(home: RecordValue, key: keyof typeof homeDraft) {
  const hero = record(home.hero)
  const field =
    key === "title"
      ? hero.heading
      : key === "eyebrow" || key === "description"
        ? hero[key]
        : home[key]
  return text(field, preview ? homeDraft[key] : "")
}

export function safeHref(value: unknown): string | undefined {
  const url = text(value)
  return /^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(url) ? url : undefined
}

export function resourceType(resource: RecordValue) {
  return text(resource.resourceType, "Resource")
}

export function selectedDocuments(value: unknown, fallback: RecordValue[]) {
  if (!Array.isArray(value) || !value.length) return fallback
  return value.flatMap((entry) => {
    const populated = record(entry)
    if (populated._status === "published") return [populated]
    const id =
      typeof entry === "string" || typeof entry === "number"
        ? entry
        : populated.id
    const found = fallback.find(
      (document) => String(document.id) === String(id)
    )
    return found ? [found] : []
  })
}

export function contentItems(
  home: RecordValue,
  key: string,
  draft: RecordValue[]
): RecordValue[] {
  const published = items(home[key])
  return published.length ? published : preview ? draft : []
}
