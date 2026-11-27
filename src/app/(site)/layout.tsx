import type { Metadata } from "next"
import localFont from "next/font/local"
import { Navigation } from "@/components/site/navigation"
import { Footer, StatusBanner } from "@/components/site/shell"
import { RetireOfflineWorker } from "@/components/system/retire-offline-worker"
import {
  configured,
  getGlobal,
  getPage,
  hasPublishedPicks,
  preview,
  text,
} from "@/lib/site/content"
import { FormPolicyProvider } from "@/components/site/forms"
import { getSiteURL } from "@/lib/site-url"
import { isEmailDeliveryEnabled } from "@/lib/email-availability"
import "./site.css"
import { siteDescription } from "@/lib/site/homepage-design"

export const dynamic = "force-dynamic"

const manrope = localFont({
  src: "./fonts/manrope-latin.woff2",
  weight: "400 800",
  variable: "--font-manrope",
  display: "swap",
})
const caveat = localFont({
  src: "./fonts/caveat-latin.woff2",
  weight: "400 600",
  variable: "--font-caveat",
  display: "swap",
})
const mono = localFont({
  src: "./fonts/ibm-plex-mono-latin.woff2",
  weight: "400",
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: getSiteURL(),
  title: {
    default: "Sara Gibby · Clear answers for your biggest tech decisions",
    template: "%s · Sara Gibby",
  },
  description: siteDescription,
  ...(preview || !configured
    ? { robots: { index: false, follow: false } }
    : {}),
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [privacy, kit, picksLive] = await Promise.all([
    getPage("privacy"),
    getGlobal("starterKit"),
    // The nav falls back to "Picks (soon)" rather than taking the whole site
    // down if picks can't be read (for example, before the migration runs).
    hasPublishedPicks().catch((error: unknown) => {
      console.error("Published picks could not be counted.", error)
      return false
    }),
  ])
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${caveat.variable} ${mono.variable}`}
    >
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <StatusBanner />
        <Navigation picksLive={picksLive} />
        <FormPolicyProvider
          deliveryEnabled={isEmailDeliveryEnabled()}
          enabled={preview || privacy?.ownerApproved === true}
          kitReady={preview || Boolean(text(kit.title) && text(kit.version))}
        >
          <main id="main">{children}</main>
        </FormPolicyProvider>
        <Footer picksLive={picksLive} />
        <RetireOfflineWorker />
      </body>
    </html>
  )
}
