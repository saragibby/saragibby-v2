import type { MetadataRoute } from "next"
import { getSiteURL } from "@/lib/site-url"
import {
  getPublishedPicks,
  getSitemapDocuments,
  preview,
  text,
} from "@/lib/site/content"
import { resourcePath, toResourceSummary } from "@/lib/site/resources"

export const dynamic = "force-dynamic"

const pageRoutes = new Set([
  "privacy",
  "terms",
  "disclaimer",
])
const fixedRoutes = [
  "/",
  "/learn",
  "/toolkit",
  "/picks",
  "/picks/breakup-pile",
  "/course",
  "/community",
  "/newsletter",
  "/start-here",
  "/about",
  "/now",
  "/build-with-me",
]

function modified(value: unknown): Date | undefined {
  const parsed = new Date(text(value))
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (preview) return []
  const origin = getSiteURL()
  const [resources, pages, picks] = await Promise.all([
    getSitemapDocuments("resources"),
    getSitemapDocuments("pages"),
    getPublishedPicks(),
  ])
  const entries: MetadataRoute.Sitemap = fixedRoutes.map((path) => ({
    url: new URL(path, origin).href,
  }))
  for (const page of pages) {
    const slug = text(page.slug)
    if (!pageRoutes.has(slug) || page.ownerApproved !== true) continue
    entries.push({
      url: new URL(`/${slug}`, origin).href,
      lastModified: modified(page.updatedAt),
    })
  }
  for (const resource of resources) {
    const summary = toResourceSummary(resource)
    const path = summary && resourcePath(summary)
    if (!path) continue
    entries.push({
      url: new URL(path, origin).href,
      lastModified:
        modified(resource.updatedAt) ?? modified(resource.publishedAt),
    })
  }
  for (const pick of picks) {
    entries.push({
      url: new URL(`/picks/${pick.slug}`, origin).href,
      lastModified: modified(pick.lastChecked),
    })
  }
  return entries
}
