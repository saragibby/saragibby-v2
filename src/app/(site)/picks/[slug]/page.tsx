import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PickBadge, RecheckLabel } from "@/components/site/pick-card"
import { PageIntro } from "@/components/site/shell"
import { getPublishedPick, preview } from "@/lib/site/content"
import { pickUrlProblem, pillarLabel, saraTest } from "@/lib/site/picks"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pick = await getPublishedPick((await params).slug)
  return {
    title: pick ? `${pick.name}: Sara Test results` : "Pick",
    description: pick?.verdict,
    ...(preview ? { robots: { index: false, follow: false } } : {}),
  }
}

export default async function PickPage({ params }: Props) {
  const pick = await getPublishedPick((await params).slug)
  if (!pick) notFound()
  const retired = pick.status === "breakup"
  return (
    <div className="container section interior pick-page">
      <Link
        className="text-link back-link"
        href={retired ? "/picks/breakup-pile" : "/picks"}
      >
        ← {retired ? "The Breakup Pile" : "All picks"}
      </Link>
      <PageIntro label={pillarLabel(pick.pillar)} title={pick.name}>
        <div className="pick-meta">
          <PickBadge status={pick.status} lastChecked={pick.lastChecked} />
          <RecheckLabel lastChecked={pick.lastChecked} />
        </div>
        {pick.marginNote && (
          <p className="handwriting pick-note">{pick.marginNote}</p>
        )}
      </PageIntro>
      <div className="pick-summary">
        <section
          className="card featured pick-verdict"
          aria-labelledby="verdict"
        >
          <p className="eyebrow" id="verdict">
            The verdict
          </p>
          <p className="lead">{pick.verdict}</p>
          {retired && pick.breakupNote && (
            <p>
              <strong>Why we broke up:</strong> {pick.breakupNote}
            </p>
          )}
        </section>
        <dl className="pick-facts">
          {pick.whoItsFor && (
            <div>
              <dt>Who it’s for</dt>
              <dd>{pick.whoItsFor}</dd>
            </div>
          )}
          {pick.realCost && (
            <div>
              <dt>Real cost</dt>
              <dd>{pick.realCost}</dd>
            </div>
          )}
          {!pickUrlProblem(pick.url) && (
            <div>
              <dt>Website</dt>
              <dd>
                <a href={pick.url} rel="noopener noreferrer">
                  {new URL(pick.url).hostname.replace(/^www\./, "")}
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>
      <section className="sara-test" aria-labelledby="sara-test">
        <p className="eyebrow">How it did</p>
        <h2 id="sara-test">The Sara Test</h2>
        <ol className="grid two pick-answers">
          {saraTest.map(({ field, question }) => (
            <li className="card" key={field}>
              <h3>{question}</h3>
              <p>{pick.saraTest?.[field] || "Not answered yet."}</p>
            </li>
          ))}
        </ol>
        <p className="small muted">
          No affiliate links and no referral fees.{" "}
          <Link href="/picks#how-i-choose">How I choose picks</Link>.
        </p>
      </section>
    </div>
  )
}
