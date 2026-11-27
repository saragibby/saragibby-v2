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

export const siteNavigation = [
  { label: "Reviews", href: "/build-with-me" },
  { label: "Playbooks", href: "/resources" },
  { label: "About", href: "/about" },
]

/** "Picks" once at least one pick is published, "Picks (soon)" until then. */
export function picksNavLabel(picksLive: boolean) {
  return picksLive ? "Picks" : "Picks (soon)"
}

export const comingSoonNavigation = [
  { label: "Course", href: "/course" },
  { label: "Ask Sara", href: "/community" },
]

export const siteSocialLinks: { label: string; url: string }[] = [
  { label: "LinkedIn", url: linkedInUrl },
  { label: "Email", url: `mailto:${contactEmail}` },
]
