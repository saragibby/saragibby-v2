import type { MetadataRoute } from "next"
import { getSiteURL } from "@/lib/site-url"
import { getSitemapDocuments, preview, text } from "@/lib/site/content"

export const dynamic = "force-dynamic"

const pageRoutes = new Set([
  "start-here",
  "about",
  "now",
  "build-with-me",
  "privacy",
  "terms",
  "disclaimer",
])
const fixedRoutes = [
  "/",
  "/resources",
  "/course",
  "/community",
  "/shop",
  "/newsletter",
]

function modified(value: unknown): Date | undefined {
  const parsed = new Date(text(value))
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (preview) return []
  const origin = getSiteURL()
  const [resources, pages] = await Promise.all([
    getSitemapDocuments("resources"),
    getSitemapDocuments("pages"),
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
    const slug = text(resource.slug)
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) continue
    entries.push({
      url: new URL(`/resources/${slug}`, origin).href,
      lastModified:
        modified(resource.updatedAt) ?? modified(resource.publishedAt),
    })
  }
  return entries
}
