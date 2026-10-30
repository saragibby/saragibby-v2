import Link from "next/link"
import { getDocuments, resourceType, text } from "@/lib/site/content"
import { PageIntro } from "@/components/site/shell"
import { ContentImage } from "@/components/site/rich-text"

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
      ) : (
        <div className="empty-state">
          <h2>
            {resources.length
              ? "No matching resources."
              : "The playbook library is on the workbench."}
          </h2>
          <p>
            {resources.length
              ? "Try another type or topic."
              : "There are no published playbooks yet. Practical guides will appear here when they’re ready."}
          </p>
          <Link className="text-link" href="/newsletter">
            Get the free CTO Kit →
          </Link>
        </div>
      )}
    </div>
  )
}
