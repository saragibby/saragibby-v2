import type { Metadata } from "next"
import Link from "next/link"
import { PickCard } from "@/components/site/pick-card"
import { PageIntro } from "@/components/site/shell"
import { getPublishedPicks, preview } from "@/lib/site/content"
import { splitPicks } from "@/lib/site/picks"
import { bestieSignOff } from "@/lib/site/site-navigation"

export const metadata: Metadata = {
  title: "The Breakup Pile",
  description:
    "Retired tool picks, with a plain note about why each one no longer passes The Sara Test.",
  ...(preview ? { robots: { index: false, follow: false } } : {}),
}

export default async function BreakupPile() {
  const { retired } = splitPicks(await getPublishedPicks())
  return (
    <div className="container section interior breakup-pile">
      <Link className="text-link back-link" href="/picks">
        ← All picks
      </Link>
      <PageIntro label="Retired picks" title="The Breakup Pile.">
        <p>
          As your bestie, I can’t let you stay with these. Each one used to pass
          The Sara Test. Here’s what changed.
        </p>
      </PageIntro>
      {retired.length ? (
        <div className="grid three pick-grid">
          {retired.map((pick) => (
            <PickCard pick={pick} key={pick.slug} showBreakupNote />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No breakups yet.</h2>
          <p>When a pick stops passing The Sara Test, it lands here.</p>
        </div>
      )}
      <details className="breakup-letter">
        <summary>Read the breakup letter</summary>
        <div className="breakup-letter-body">
          <p>Dear tool,</p>
          <p>
            It’s not me. It’s your export button. You changed, your pricing
            changed, and I can’t pretend I didn’t notice.
          </p>
          <p>I’m keeping the free trial hoodie.</p>
          <p className="handwriting">{bestieSignOff}</p>
        </div>
      </details>
    </div>
  )
}
