import type { Metadata } from "next"
import localFont from "next/font/local"
import { Navigation } from "@/components/site/navigation"
import { Footer, StatusBanner } from "@/components/site/shell"
import { RetireOfflineWorker } from "@/components/system/retire-offline-worker"
import {
  configured,
  getGlobal,
  getPage,
  items,
  preview,
  safeHref,
  text,
} from "@/lib/site/content"
import { FormPolicyProvider } from "@/components/site/forms"
import { getSiteURL } from "@/lib/site-url"
import { isEmailDeliveryEnabled } from "@/lib/email-availability"
import "./site.css"

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
    default: "Sara Gibby · The 10 Hour Founder",
    template: "%s · Sara Gibby",
  },
  description:
    "Practical AI systems for building something real, a few hours at a time.",
  ...(preview || !configured
    ? { robots: { index: false, follow: false } }
    : {}),
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [site, privacy, kit] = await Promise.all([
    getGlobal("site"),
    getPage("privacy"),
    getGlobal("starterKit"),
  ])
  const navigation = items(site.navigation).flatMap((item) => {
    const href = safeHref(item.href)
    return href && text(item.label) ? [[text(item.label), href]] : []
  })
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
        <Navigation
          links={navigation.length ? navigation : undefined}
          name={text(site.siteName, "Sara Gibby")}
        />
        <FormPolicyProvider
          deliveryEnabled={isEmailDeliveryEnabled()}
          enabled={preview || privacy?.ownerApproved === true}
          kitReady={preview || Boolean(text(kit.title) && text(kit.version))}
        >
          <main id="main">{children}</main>
        </FormPolicyProvider>
        <Footer site={site} />
        <RetireOfflineWorker />
      </body>
    </html>
  )
}
