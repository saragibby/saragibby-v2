import type { Metadata } from "next"
import Link from "next/link"
import { PickCard } from "@/components/site/pick-card"
import { PageIntro } from "@/components/site/shell"
import { picks, splitPicks } from "@/lib/site/picks"

export const metadata: Metadata = {
  title: "The Breakup Pile",
  description:
    "Retired tool picks, with a plain note about why each one no longer passes The Sara Test.",
}

export default function BreakupPile() {
  const { retired } = splitPicks(picks)
  return (
    <div className="container section interior">
      <Link className="text-link" href="/picks">
        ← All picks
      </Link>
      <PageIntro label="Retired picks" title="The Breakup Pile.">
        <p>
          Where picks go when they stop passing. They stay up, with a note
          about why we broke up.
        </p>
      </PageIntro>
      {retired.length > 0 && (
        <p className="handwriting playbook-note">
          as your CTO bestie, I can’t let you stay with these.
        </p>
      )}
      {retired.length ? (
        <div className="grid three">
          {retired.map((pick) => (
            <PickCard pick={pick} key={pick.name} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No breakups yet.</h2>
          <p>When a pick stops passing The Sara Test, it lands here.</p>
        </div>
      )}
    </div>
  )
}
