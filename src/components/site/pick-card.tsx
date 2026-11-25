import { lastCheckedLabel, pickStatusLabels, type Pick } from "@/lib/site/picks"

export function PickCard({ pick }: { pick: Pick }) {
  return (
    <article className="card pick-card">
      <p className={`pick-badge is-${pick.status}`}>
        {pickStatusLabels[pick.status]}, last checked{" "}
        <time dateTime={pick.lastChecked}>
          {lastCheckedLabel(pick.lastChecked)}
        </time>
      </p>
      <h2>
        <a href={pick.url}>{pick.name}</a>
      </h2>
      <p className="muted">{pick.summary}</p>
      {pick.status === "changed" && (
        <p>
          <strong>What changed:</strong> {pick.whatChanged}
        </p>
      )}
      {pick.status === "breakup" && (
        <p>
          <strong>Why we broke up:</strong> {pick.whyWeBrokeUp}
        </p>
      )}
    </article>
  )
}
