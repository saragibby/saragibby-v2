import type { Metadata } from "next"
import Link from "next/link"
import { PickCard } from "@/components/site/pick-card"
import { PageIntro } from "@/components/site/shell"
import { picks, saraTest, splitPicks } from "@/lib/site/picks"
import { bestieLine, kitName } from "@/lib/site/site-navigation"

export const metadata: Metadata = {
  title: "Bestie-approved picks",
  description:
    "Tools that pass The Sara Test: six plain questions about your data, security, cost, and how to leave. No affiliate links.",
}

export default function Picks() {
  const { current } = splitPicks(picks)
  return (
    <div className="container section interior">
      <PageIntro label="Picks" title="Bestie-approved.">
        <p>{bestieLine} I kick the tires so you don’t have to.</p>
      </PageIntro>
      {current.length ? (
        <div className="grid three">
          {current.map((pick) => (
            <PickCard pick={pick} key={pick.name} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>Bestie-approved picks coming soon.</h2>
          <p>
            The first ones will show up here. Get the free kit in the meantime.
          </p>
          <Link className="text-link" href="/newsletter">
            Get the free {kitName} <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
      <section className="sara-test" aria-labelledby="sara-test">
        <p className="eyebrow">How I choose picks</p>
        <h2 id="sara-test">
          The Sara Test: 6 questions before I trust a tool.
        </h2>
        <p className="lead">
          Every tool gets the same six questions. It’s the plain-words version
          of the vendor review a CTO does.
        </p>
        <ol className="grid three">
          {saraTest.map(({ question, detail }) => (
            <li className="card" key={question}>
              <h3>{question}</h3>
              <p className="muted">{detail}</p>
            </li>
          ))}
        </ol>
        <p className="handwriting">no affiliate links. pinky promise.</p>
        <p>
          Every pick shows when I last checked it. If a tool stops passing, it
          moves to{" "}
          <Link href="/picks/breakup-pile">The Breakup Pile</Link> with a note
          about why.
        </p>
      </section>
    </div>
  )
}
