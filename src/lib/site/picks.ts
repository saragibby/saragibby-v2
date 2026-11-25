type PickBase = {
  name: string
  url: string
  summary: string
  /** Date of the most recent test, as YYYY-MM-DD. */
  lastChecked: string
}

export type Pick = PickBase &
  (
    | { status: "approved" }
    | { status: "changed"; whatChanged: string }
    | { status: "breakup"; whyWeBrokeUp: string }
  )

export const pickStatusLabels: Record<Pick["status"], string> = {
  approved: "Bestie-approved",
  changed: "Changed",
  breakup: "Breakup Pile",
}

// Add a pick once it has been through The Sara Test. Retired picks stay in
// this list with the "breakup" status and move to the Breakup Pile page.
export const picks: Pick[] = []

export const saraTest = [
  {
    question: "Where does my stuff go?",
    detail:
      "Where your data is stored, how long it’s kept, and whether it trains on what you paste in.",
  },
  {
    question: "Who else can get in?",
    detail: "Two-factor login, admin controls, who can see what.",
  },
  {
    question: "Does it play nice with what I already use?",
    detail: "Fit with your current tools, and whether you can export.",
  },
  {
    question: "What will it really cost me next year?",
    detail: "True cost at your size, including per-seat creep.",
  },
  {
    question: "Can I break up with it?",
    detail: "Getting your data back out and leaving.",
  },
  {
    question: "What happens when it’s wrong?",
    detail: "Because it will be. Sometimes. Confidently.",
  },
]

/** "2026-11-25" becomes "Nov 2026". */
export function lastCheckedLabel(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`))
}

export function splitPicks(all: Pick[]) {
  const newestFirst = [...all].sort((a, b) =>
    b.lastChecked.localeCompare(a.lastChecked)
  )
  return {
    current: newestFirst.filter((pick) => pick.status !== "breakup"),
    retired: newestFirst.filter((pick) => pick.status === "breakup"),
  }
}
