import type { Metadata } from "next"
import Link from "next/link"
import { PickCard } from "@/components/site/pick-card"
import { PageIntro } from "@/components/site/shell"
import { getPublishedPicks, preview } from "@/lib/site/content"
import {
  pickPillars,
  pickStatuses,
  recheckAfterDays,
  saraTest,
  sortPicks,
} from "@/lib/site/picks"
import { bestieLine, kitName } from "@/lib/site/site-navigation"

export const metadata: Metadata = {
  title: "Bestie-approved picks",
  description:
    "Tools that pass The Sara Test: six plain questions about your data, security, cost, and how to leave. No affiliate links.",
  ...(preview ? { robots: { index: false, follow: false } } : {}),
}

type Filters = { pillar?: string; status?: string }

function chosen(value: string | string[] | undefined, allowed: string[]) {
  return typeof value === "string" && allowed.includes(value)
    ? value
    : undefined
}

function filterHref(filters: Filters) {
  const query = new URLSearchParams(
    Object.entries(filters).filter(([, value]) => value) as [string, string][]
  ).toString()
  return query ? `/picks?${query}` : "/picks"
}

function FilterGroup({
  label,
  name,
  options,
  filters,
  allLabel,
}: {
  label: string
  name: keyof Filters
  options: readonly { label: string; value: string }[]
  filters: Filters
  allLabel: string
}) {
  return (
    <nav className="pick-filter" aria-label={label}>
      <p className="eyebrow">{label}</p>
      <ul>
        {[{ label: allLabel, value: undefined }, ...options].map((option) => {
          const current = filters[name] === option.value
          return (
            <li key={option.label}>
              <Link
                href={filterHref({ ...filters, [name]: option.value })}
                aria-current={current ? "true" : undefined}
                scroll={false}
              >
                {option.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default async function Picks({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const filters: Filters = {
    pillar: chosen(
      params.pillar,
      pickPillars.map(({ value }) => value)
    ),
    status: chosen(
      params.status,
      pickStatuses.map(({ value }) => value)
    ),
  }
  const all = sortPicks(await getPublishedPicks())
  const shown = all.filter(
    (pick) =>
      (!filters.pillar || pick.pillar === filters.pillar) &&
      (filters.status
        ? pick.status === filters.status
        : pick.status !== "breakup")
  )
  return (
    <div className="container section interior">
      <PageIntro label="Picks" title="Bestie-approved.">
        <p>{bestieLine} I kick the tires so you don’t have to.</p>
      </PageIntro>
      {all.length ? (
        <>
          <div className="pick-filters">
            <FilterGroup
              label="Pillar"
              name="pillar"
              options={pickPillars}
              filters={filters}
              allLabel="All pillars"
            />
            <FilterGroup
              label="Status"
              name="status"
              options={pickStatuses}
              filters={filters}
              allLabel="Current picks"
            />
          </div>
          {shown.length ? (
            <div className="grid three pick-grid">
              {shown.map((pick) => (
                <PickCard
                  pick={pick}
                  key={pick.slug}
                  showBreakupNote={filters.status === "breakup"}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>Nothing here yet.</h2>
              <p>No picks match those filters.</p>
              <Link className="text-link" href="/picks">
                See all current picks <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <h2>The library is on the workbench.</h2>
          <p>Bestie-approved picks coming soon.</p>
          <Link className="text-link" href="/newsletter">
            Get the free {kitName} in the meantime{" "}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
      <section className="sara-test" aria-labelledby="how-i-choose">
        <p className="eyebrow">How I choose picks</p>
        <h2 id="how-i-choose">Same six questions. Every tool.</h2>
        <ul className="check-list pick-rules">
          <li>
            <strong>No affiliate links.</strong> Every link goes straight to the
            tool.
          </li>
          <li>
            <strong>No referral fees.</strong> Nobody pays to be here, and
            nobody pays me when you sign up.
          </li>
          <li>
            <strong>The same six questions.</strong> Every tool takes The Sara
            Test below, and every pick shows when I last checked it. After{" "}
            {recheckAfterDays} days it’s due for another look. Picks that stop
            passing move to{" "}
            <Link href="/picks/breakup-pile">The Breakup Pile</Link>.
          </li>
        </ul>
        <h3 className="sara-test-title">The Sara Test</h3>
        <ol className="grid three">
          {saraTest.map(({ question, detail }) => (
            <li className="card" key={question}>
              <h4>{question}</h4>
              <p className="muted">{detail}</p>
            </li>
          ))}
        </ol>
        <p className="handwriting">no affiliate links. pinky promise.</p>
      </section>
    </div>
  )
}
