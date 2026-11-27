import { withPayload } from "@payloadcms/next/withPayload"
import type { NextConfig } from "next"

const config: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ["nodemailer"],
  async redirects() {
    // /resources became /learn and /toolkit. Item links (/resources/<slug>)
    // are redirected by src/app/(site)/resources/[slug]/route.ts, which
    // knows which hub each item belongs to.
    return [{ source: "/resources", destination: "/toolkit", statusCode: 301 }]
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          ...(process.env.SITE_PREVIEW === "true" || process.env.VERCEL_ENV === "preview"
            ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
            : []),
        ],
      },
      {
        source: "/sw.js",
        headers: [{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" }],
      },
    ]
  },
}

export default withPayload(config)
