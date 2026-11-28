import Link from "next/link"
import { homepageDesign, kitCard } from "@/lib/site/homepage-design"
import { pickPillars } from "@/lib/site/picks"
import {
  filterByPillar,
  groupToolkit,
  resourceAccessLabel,
  resourceHub,
  resourceLastCheckedLabel,
  resourcePath,
  resourcePillarLabel,
  resourceTypeLabel,
  type ResourceSummary,
} from "@/lib/site/resources"
import { kitLabel, kitName } from "@/lib/site/site-navigation"

/** Bolds the named part of each kit item, as on the homepage. */
export function KitItem({ label }: { label: string }) {
  return label
    .split(/(A one-hour worksheet|The Sara Test|A “Safe to start” one-pager)/)
    .map((part, index) =>
      index % 2 === 1 ? <strong key={index}>{part}</strong> : part
    )
}

export function KitCard() {
  return (
    <article className="card featured kit-card">
      <p className="eyebrow">{kitCard.eyebrow}</p>
      <h2>{kitCard.title}</h2>
      <p>{kitCard.description}</p>
      <ul className="check-list">
        {homepageDesign.kitContents.map((item) => (
          <li key={item}>
            <KitItem label={item} />
          </li>
        ))}
      </ul>
      <Link className="text-link" href={kitCard.href}>
        {kitCard.ctaLabel} <span aria-hidden="true">→</span>
      </Link>
    </article>
  )
}

function KitButton() {
  return (
    <Link className="button" href={kitCard.href}>
      Get the {kitLabel}
    </Link>
  )
}

/** Pillar, access (Toolkit only) and last checked. Nothing when all empty. */
export function ResourceMeta({ resource }: { resource: ResourceSummary }) {
  const pillar = resourcePillarLabel(resource.pillar)
  const toolkit = resourceHub(resource.resourceType) === "toolkit"
  const checked = resourceLastCheckedLabel(resource.lastChecked)
  if (!pillar && !toolkit && !checked) return null
  return (
    <ul className="resource-meta" aria-label="Details">
      {pillar && <li className="resource-pillar">{pillar}</li>}
      {toolkit && (
        <li className="resource-access">
          {resourceAccessLabel(resource.access)}
        </li>
      )}
      {checked && resource.lastChecked && (
        <li className="resource-checked">
          <time dateTime={resource.lastChecked.slice(0, 10)}>{checked}</time>
        </li>
      )}
    </ul>
  )
}

export function ResourceCard({ resource }: { resource: ResourceSummary }) {
  const href = resourcePath(resource)
  if (!href) return null
  return (
    <article className="card resource-card">
      <p className="eyebrow">{resourceTypeLabel(resource.resourceType)}</p>
      <h3>
        <Link href={href}>{resource.title}</Link>
      </h3>
      <p className="muted">{resource.excerpt}</p>
      <ResourceMeta resource={resource} />
    </article>
  )
}

function PillarFilter({
  basePath,
  pillar,
}: {
  basePath: string
  pillar: string | undefined
}) {
  return (
    <div className="pick-filters">
      <nav className="pick-filter" aria-label="Pillar">
        <p className="eyebrow">Pillar</p>
        <ul>
          {[{ label: "All pillars", value: undefined }, ...pickPillars].map(
            (option) => (
              <li key={option.label}>
                <Link
                  href={
                    option.value
                      ? `${basePath}?pillar=${option.value}`
                      : basePath
                  }
                  aria-current={pillar === option.value ? "true" : undefined}
                  scroll={false}
                >
                  {option.label}
                </Link>
              </li>
            )
          )}
        </ul>
      </nav>
    </div>
  )
}

function CourseCard() {
  return (
    <article className="card course-card">
      <p className="eyebrow">Course · In development</p>
      <h3>
        <Link href="/course">The course (soon)</Link>
      </h3>
      <p className="muted">
        A practical, self-paced course for making stronger tech calls without
        becoming a developer.
      </p>
    </article>
  )
}

/** The /learn list. `resources` should already be Learn items. */
export function LearnHub({
  resources,
  pillar,
}: {
  resources: ResourceSummary[]
  pillar: string | undefined
}) {
  if (!resources.length)
    return (
      <>
        <div className="empty-state hub-empty">
          <p>
            The first guides are on the workbench. Start with the free{" "}
            {kitName}.
          </p>
          <KitButton />
        </div>
        <div className="grid three resource-grid">
          <CourseCard />
        </div>
      </>
    )
  const shown = filterByPillar(resources, pillar)
  return (
    <>
      <PillarFilter basePath="/learn" pillar={pillar} />
      {shown.length ? (
        <div className="grid three resource-grid">
          {shown.map((resource) => (
            <ResourceCard resource={resource} key={resource.slug} />
          ))}
          <CourseCard />
        </div>
      ) : (
        <div className="empty-state">
          <h2>Nothing here yet.</h2>
          <p>No guides match that pillar.</p>
          <Link className="text-link" href="/learn">
            See everything in Learn <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </>
  )
}

/** The /toolkit sections. `resources` should already be Toolkit items. */
export function ToolkitHub({ resources }: { resources: ResourceSummary[] }) {
  const sections = groupToolkit(resources)
  return (
    <>
      <section className="toolkit-featured" aria-label="Featured">
        <KitCard />
      </section>
      {sections.length ? (
        sections.map((section) => (
          <section
            className="toolkit-section"
            key={section.id}
            aria-labelledby={`toolkit-${section.id}`}
          >
            <h2 id={`toolkit-${section.id}`}>{section.title}</h2>
            <div className="grid three resource-grid">
              {section.items.map((resource) => (
                <ResourceCard resource={resource} key={resource.slug} />
              ))}
            </div>
          </section>
        ))
      ) : (
        <p className="handwriting toolkit-soon">More tools coming soon.</p>
      )}
    </>
  )
}
