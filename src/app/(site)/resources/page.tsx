import Link from "next/link"
import { getDocuments, resourceType, text } from "@/lib/site/content"
import { PageIntro } from "@/components/site/shell"
import { ContentImage } from "@/components/site/rich-text"
import { kitName } from "@/lib/site/site-navigation"

export const metadata = { title: "Playbooks" }

export default async function Resources({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; topic?: string }>
}) {
  const [resources, filters] = await Promise.all([
    getDocuments("resources"),
    searchParams,
  ])
  const types = [
    ...new Set(
      resources.map((resource) => resourceType(resource)).filter(Boolean)
    ),
  ]
  const topics = [
    ...new Set(
      resources.map((resource) => text(resource.topic)).filter(Boolean)
    ),
  ]
  const filtered = resources.filter(
    (resource) =>
      (!filters.type || resource.resourceType === filters.type) &&
      (!filters.topic || resource.topic === filters.topic)
  )
  return (
    <div className="container section interior">
      <PageIntro label="Playbooks" title="Clear guides for big tech decisions.">
        <p>
          Practical guides to technology, hiring, vendors, and using AI in real
          businesses.
        </p>
      </PageIntro>
      <p className="handwriting playbook-note">
        short reads. no jargon. use them today.
      </p>
      {resources.length > 0 && (
        <form className="filter-form" action="/resources">
          <div>
            <label htmlFor="type">Type</label>
            <select name="type" id="type" defaultValue={filters.type ?? ""}>
              <option value="">All types</option>
              {types.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="topic">Topic</label>
            <select name="topic" id="topic" defaultValue={filters.topic ?? ""}>
              <option value="">All topics</option>
              {topics.map((topic) => (
                <option key={topic}>{topic}</option>
              ))}
            </select>
          </div>
          <button className="button">Filter playbooks</button>
          <Link href="/resources">Clear filters</Link>
        </form>
      )}
      {filtered.length ? (
        <div className="grid three">
          {filtered.map((resource) => (
            <article className="card" key={text(resource.slug)}>
              <ContentImage value={resource.cover} />
              <p className="eyebrow">
                {resourceType(resource)}{" "}
                {resource.topic ? `· ${text(resource.topic)}` : ""}
              </p>
              <h2>
                <Link href={`/resources/${text(resource.slug)}`}>
                  {text(resource.title)}
                </Link>
              </h2>
              <p className="muted">{text(resource.excerpt)}</p>
              <Link
                className="text-link"
                href={`/resources/${text(resource.slug)}`}
              >
                Read resource →
              </Link>
            </article>
          ))}
        </div>
      ) : resources.length ? (
        <div className="empty-state">
          <h2>No matching resources.</h2>
          <p>Try another type or topic.</p>
        </div>
      ) : (
        <section className="course-layout">
          <div className="prose">
            <h2>The library is on the workbench.</h2>
            <p>
              Bestie-approved picks coming soon. Short, practical guides for
              the decisions founders and small businesses run into most are on
              the way, too. Get the free kit in the meantime, and you’ll hear
              when the first ones are ready.
            </p>
            <p>
              Curious what earns a pick? <Link href="/picks">See The Sara Test</Link>.
            </p>
            <Link className="button" href="/newsletter">
              Get the free {kitName}
            </Link>
          </div>
          <div className="worksheet playbook-sheet">
            <p className="eyebrow">Coming first</p>
            <h3>On the workbench</h3>
            {[
              "Is this development quote fair?",
              "Agency or freelancer?",
              "Where to start with AI",
              "Hiring your first developer",
            ].map((title) => (
              <div className="worksheet-row" key={title}>
                <span>{title}</span>
                <span className="lesson-box" aria-hidden="true" />
              </div>
            ))}
            <p className="handwriting">which one do you need first?</p>
          </div>
        </section>
      )}
    </div>
  )
}
