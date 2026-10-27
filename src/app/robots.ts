import type { MetadataRoute } from "next"
import { getSiteURL } from "@/lib/site-url"

export const dynamic = "force-dynamic"

export default function robots(): MetadataRoute.Robots {
  if (process.env.SITE_PREVIEW === "true" || process.env.VERCEL_ENV === "preview") {
    return { rules: { userAgent: "*", disallow: "/" } }
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/confirm", "/unsubscribe"],
    },
    sitemap: new URL("/sitemap.xml", getSiteURL()).href,
  }
}
