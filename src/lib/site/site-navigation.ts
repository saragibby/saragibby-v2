// Placeholder until the new kit is named. Change it here and every surface follows.
export const kitName = "CTO Starter Kit"
export const kitLabel = `Free ${kitName}`

export const kitHeading = "Leave with your one-page AI plan."
export const kitPromise =
  "One hour, one busywork task, one plan you can actually use."

export const bestieName = "Your CTO bestie"
export const bestieLine =
  "25 years of watching software break, so yours doesn’t."
export const bestieSignOff = "xo, your CTO bestie"

// Proposed name. Change it here if a different one is confirmed.
export const newsletterName = "Margin Notes"

export const contactEmail = "heythere@saragibby.com"
export const linkedInUrl = "https://www.linkedin.com/in/saragibby/"

// The paid service's name everywhere it appears. Rename it here.
export const SERVICE_NAV_LABEL = "Work with Sara"
export const serviceHref = "/build-with-me"

export const kitHref = "/newsletter"

/** "Picks" once at least one pick is published, "Picks (soon)" until then. */
export function picksNavLabel(picksLive: boolean) {
  return picksLive ? "Picks" : "Picks (soon)"
}

export type NavLink = { label: string; href: string }

/** Top nav, in order. "Work with Sara" and the kit button sit to the right. */
export function primaryNavigation(picksLive: boolean): NavLink[] {
  return [
    { label: "Learn", href: "/learn" },
    { label: "Toolkit", href: "/toolkit" },
    { label: picksNavLabel(picksLive), href: "/picks" },
    { label: "Ask Sara", href: "/community" },
  ]
}

export function footerNavigation(
  picksLive: boolean
): { title: string; links: NavLink[] }[] {
  return [
    {
      title: "Learn",
      links: [
        { label: "Learn", href: "/learn" },
        { label: "Toolkit", href: "/toolkit" },
        { label: picksNavLabel(picksLive), href: "/picks" },
        { label: "Course (soon)", href: "/course" },
      ],
    },
    {
      title: "Get help",
      links: [
        { label: "Ask Sara (soon)", href: "/community" },
        { label: SERVICE_NAV_LABEL, href: serviceHref },
        { label: kitLabel, href: kitHref },
      ],
    },
    {
      title: "The fine print",
      links: [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
        { label: "Disclaimer", href: "/disclaimer" },
      ],
    },
  ]
}

export const siteSocialLinks: { label: string; url: string }[] = [
  { label: "LinkedIn", url: linkedInUrl },
  { label: "Email", url: `mailto:${contactEmail}` },
]
