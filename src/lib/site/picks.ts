import type { ToolPick } from "@/payload-types"

export type { ToolPick }

/** A pick's editable content, as stored in Payload. */
export type PickData = Omit<ToolPick, "id" | "createdAt" | "updatedAt">

export const pickPillars = [
  { label: "Get your time back", value: "time-back" },
  { label: "Grow without the hype", value: "grow" },
  { label: "Don’t get burned", value: "dont-get-burned" },
] as const

export const pickStatuses = [
  { label: "Bestie-approved", value: "approved" },
  { label: "Changed", value: "changed" },
  { label: "Breakup Pile", value: "breakup" },
] as const

export type PickPillar = (typeof pickPillars)[number]["value"]
export type PickStatus = (typeof pickStatuses)[number]["value"]

export function pillarLabel(value: string) {
  return pickPillars.find((pillar) => pillar.value === value)?.label ?? ""
}

export function statusLabel(value: string) {
  return pickStatuses.find((status) => status.value === value)?.label ?? ""
}

// The six questions every pick answers. `field` is the key inside the
// pick's `saraTest` group in Payload.
export const saraTest = [
  {
    field: "whereDoesMyStuffGo",
    question: "Where does my stuff go?",
    detail:
      "Where your data is stored, how long it’s kept, and whether it trains on what you paste in.",
  },
  {
    field: "whoElseCanGetIn",
    question: "Who else can get in?",
    detail: "Two-factor login, admin controls, who can see what.",
  },
  {
    field: "playsNice",
    question: "Does it play nice with what I already use?",
    detail: "Fit with your current tools, and whether you can export.",
  },
  {
    field: "costNextYear",
    question: "What will it really cost me next year?",
    detail: "True cost at your size, including per-seat creep.",
  },
  {
    field: "canIBreakUp",
    question: "Can I break up with it?",
    detail: "Getting your data back out and leaving.",
  },
  {
    field: "whenItsWrong",
    question: "What happens when it’s wrong?",
    detail: "Because it will be. Sometimes. Confidently.",
  },
] as const

export type SaraTestField = (typeof saraTest)[number]["field"]

/** A pick is due for a re-check once its last check is over 90 days old. */
export const recheckAfterDays = 90

/** Payload dates arrive as ISO strings; only the calendar day matters. */
function calendarDay(date: string) {
  return date.slice(0, 10)
}

/** "2026-11-25" (or a full ISO timestamp) becomes "Nov 2026". */
export function lastCheckedLabel(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${calendarDay(date)}T00:00:00Z`))
}

/** True once more than 90 calendar days (UTC) have passed since the check. */
export function isDueForRecheck(lastChecked: string, now = new Date()) {
  const checked = Date.parse(`${calendarDay(lastChecked)}T00:00:00Z`)
  const today = Date.parse(`${now.toISOString().slice(0, 10)}T00:00:00Z`)
  return (today - checked) / (24 * 60 * 60 * 1000) > recheckAfterDays
}

// Picks link to the plain product URL. A query string is where affiliate
// codes and tracking (utm_, ref, via, fbclid…) live, so it is not allowed.
export function pickUrlProblem(value: string): string | null {
  let url: URL
  try {
    url = new URL(value)
  } catch {
    return "Use a full link, starting with https://."
  }
  if (url.protocol !== "https:" && url.protocol !== "http:")
    return "Use a full link, starting with https://."
  if (url.username || url.password)
    return "Remove the login details from the link."
  if (value.includes("?"))
    return "Use the plain link, with nothing after a “?”. No affiliate or tracking parameters."
  return null
}

export function sortPicks<T extends PickData>(picks: T[]): T[] {
  return [...picks].sort(
    (a, b) =>
      calendarDay(b.lastChecked).localeCompare(calendarDay(a.lastChecked)) ||
      a.name.localeCompare(b.name)
  )
}

export function splitPicks<T extends PickData>(picks: T[]) {
  const sorted = sortPicks(picks)
  return {
    current: sorted.filter((pick) => pick.status !== "breakup"),
    retired: sorted.filter((pick) => pick.status === "breakup"),
  }
}
