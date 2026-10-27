export function getSiteURL(): URL {
  const configured = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL
  if (
    process.env.SITE_URL &&
    process.env.NEXT_PUBLIC_SITE_URL &&
    new URL(process.env.SITE_URL).origin !== new URL(process.env.NEXT_PUBLIC_SITE_URL).origin
  ) {
    throw new Error("SITE_URL and NEXT_PUBLIC_SITE_URL must use the same origin.")
  }
  if (!configured && process.env.SITE_PREVIEW !== "true") {
    throw new Error("NEXT_PUBLIC_SITE_URL must be configured before serving the site.")
  }
  const url = new URL(configured || "http://localhost:3000")
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an origin without credentials, path, query, or fragment.")
  }
  if (process.env.NODE_ENV === "production" && process.env.SITE_PREVIEW !== "true" && url.protocol !== "https:") {
    throw new Error("The production site must use an HTTPS origin.")
  }
  return url
}
