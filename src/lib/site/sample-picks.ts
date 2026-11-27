import type { PickData } from "./picks"

// Two made-up tools for previewing the Picks pages. `npm run seed:picks`
// adds them to Payload unpublished, and SITE_PREVIEW shows them in place of
// the database. They are not recommendations; never publish them.
export const samplePicks: PickData[] = [
  {
    published: false,
    name: "Sample: Inbox Tidy",
    slug: "sample-inbox-tidy",
    url: "https://example.com/inbox-tidy",
    pillar: "time-back",
    status: "approved",
    lastChecked: "2026-11-20T00:00:00.000Z",
    verdict:
      "A sample pick for previewing this page. A good first tool for sorting a busy shared inbox without handing over your whole account.",
    marginNote: "i’d start here",
    whoItsFor: "Teams of 1 to 10 sharing one support inbox",
    realCost: "Free for 1 inbox, then $8 per person per month",
    saraTest: {
      whereDoesMyStuffGo:
        "Stored in the US, deleted 30 days after you cancel. It doesn’t train on your email.",
      whoElseCanGetIn:
        "Two-factor login for everyone, and you choose who sees which inbox.",
      playsNice: "Works with Gmail and Outlook. Exports to a spreadsheet.",
      costNextYear:
        "About $400 a year for a team of four. The price goes up per person, so watch your headcount.",
      canIBreakUp: "Yes. One click to export, and your inbox keeps working.",
      whenItsWrong:
        "It suggests a label; you still click to apply it. Mistakes are easy to spot and undo.",
    },
    breakupNote: null,
  },
  {
    published: false,
    name: "Sample: Forever Notes",
    slug: "sample-forever-notes",
    url: "https://example.com/forever-notes",
    pillar: "dont-get-burned",
    status: "breakup",
    lastChecked: "2026-07-15T00:00:00.000Z",
    verdict:
      "A sample retired pick for previewing the Breakup Pile. It was fine until getting your notes back out stopped being possible.",
    marginNote: "we had a good run",
    whoItsFor: "Solo founders keeping meeting notes",
    realCost: "$12 a month",
    saraTest: {
      whereDoesMyStuffGo: "Stored in the US. Kept until you delete it.",
      whoElseCanGetIn: "Two-factor login. No team controls.",
      playsNice: "Calendar sync only.",
      costNextYear: "$144 a year, plus a new $5 add-on for search.",
      canIBreakUp: "Not anymore. Exports were removed in the last update.",
      whenItsWrong: "Summaries sometimes skip decisions. Check them.",
    },
    breakupNote:
      "Exports went away in the last update. If you can’t take your notes with you, it fails The Sara Test.",
  },
]
