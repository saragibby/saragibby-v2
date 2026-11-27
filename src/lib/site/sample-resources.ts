import type { ResourceSummary } from "./resources"

function body(...paragraphs: string[]) {
  return {
    root: {
      type: "root",
      children: paragraphs.map((text) => ({
        type: "paragraph",
        children: [{ type: "text", text, format: 0 }],
      })),
    },
  }
}

// Made-up Toolkit items for SITE_PREVIEW, which has no database. They show
// how /toolkit looks with content. There are deliberately no Learn samples,
// so the preview also shows the /learn empty state. Never publish these.
export const sampleResources: (ResourceSummary & { body: unknown })[] = [
  {
    title: "Sample: Vendor quote checklist",
    slug: "sample-vendor-quote-checklist",
    resourceType: "checklist",
    pillar: "dont-get-burned",
    access: "free",
    lastChecked: "2026-11-20T00:00:00.000Z",
    excerpt:
      "A sample checklist for previewing this page. Ten questions to ask before you sign a development quote.",
    body: body(
      "A sample checklist for previewing this page.",
      "Ask for an itemized scope, the assumptions behind it, and what’s not included."
    ),
  },
  {
    title: "Sample: Meeting notes prompt",
    slug: "sample-meeting-notes-prompt",
    resourceType: "prompt",
    pillar: "time-back",
    access: "email",
    lastChecked: "2026-10-02T00:00:00.000Z",
    excerpt:
      "A sample prompt for previewing this page. Turn a messy transcript into decisions and next steps.",
    body: body(
      "A sample prompt for previewing this page.",
      "Paste your notes, then ask for decisions, owners, and dates. Check the output before you send it."
    ),
  },
  {
    title: "Sample: Set up a shared inbox",
    slug: "sample-shared-inbox-how-to",
    resourceType: "how-to",
    pillar: "grow",
    access: "free",
    lastChecked: "2026-11-01T00:00:00.000Z",
    excerpt:
      "A sample how-to guide for previewing this page. One inbox, three people, nobody dropping the ball.",
    body: body(
      "A sample how-to guide for previewing this page.",
      "Start with one address, one owner per message, and one rule for when to reply."
    ),
  },
]
