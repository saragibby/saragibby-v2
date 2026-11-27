import Link from "next/link"
import {
  isDueForRecheck,
  lastCheckedLabel,
  pillarLabel,
  statusLabel,
  type PickData,
} from "@/lib/site/picks"

/** "Bestie-approved · last checked Nov 2026", plus Changed and Breakup Pile. */
export function PickBadge({
  status,
  lastChecked,
}: Pick<PickData, "status" | "lastChecked">) {
  return (
    <p className={`pick-badge is-${status}`}>
      {statusLabel(status)} · last checked{" "}
      <time dateTime={lastChecked.slice(0, 10)}>
        {lastCheckedLabel(lastChecked)}
      </time>
    </p>
  )
}

/** A quiet note once a pick's last check is more than 90 days old. */
export function RecheckLabel({ lastChecked }: { lastChecked: string }) {
  return isDueForRecheck(lastChecked) ? (
    <p className="pick-recheck">Due for a re-check</p>
  ) : null
}

export function PickCard({
  pick,
  showBreakupNote = false,
}: {
  pick: PickData
  showBreakupNote?: boolean
}) {
  return (
    <article className="card pick-card">
      <p className="eyebrow">{pillarLabel(pick.pillar)}</p>
      <h2>
        <Link href={`/picks/${pick.slug}`}>{pick.name}</Link>
      </h2>
      <div className="pick-meta">
        <PickBadge status={pick.status} lastChecked={pick.lastChecked} />
        <RecheckLabel lastChecked={pick.lastChecked} />
      </div>
      {pick.marginNote && (
        <p className="handwriting pick-note">{pick.marginNote}</p>
      )}
      <p className="muted">{pick.verdict}</p>
      {showBreakupNote && pick.breakupNote && (
        <p className="pick-breakup">
          <strong>Why we broke up:</strong> {pick.breakupNote}
        </p>
      )}
    </article>
  )
}
