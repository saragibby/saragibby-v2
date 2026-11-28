import type { Metadata } from "next"
import Link from "next/link"
import { notFound, permanentRedirect } from "next/navigation"
import { ContentImage, RichText } from "@/components/site/rich-text"
import { PageIntro } from "@/components/site/shell"
import { getResource, preview, record, safeHref, text } from "@/lib/site/content"
import { ResourceMeta } from "@/components/site/resource-hubs"
import {
  resourcePath,
  resourceTypeLabel,
  toResourceSummary,
  type ResourceHub,
} from "@/lib/site/resources"

const hubNames: Record<ResourceHub, string> = {
  learn: "Learn",
  toolkit: "the Toolkit",
}

export async function resourceMetadata(slug: string): Promise<Metadata> {
  const resource = await getResource(slug)
  const seo = record(resource?.seo)
  return {
    title: text(seo.title, text(resource?.title, "Resource")),
    description: text(seo.description, text(resource?.excerpt)),
    ...(preview ? { robots: { index: false, follow: false } } : {}),
  }
}

/** One Learn or Toolkit item. Items opened under the wrong hub move over. */
export async function ResourceDetail({
  hub,
  slug,
}: {
  hub: ResourceHub
  slug: string
}) {
  const resource = await getResource(slug)
  const summary = resource && toResourceSummary(resource)
  if (!resource || !summary) notFound()
  const path = resourcePath(summary)
  if (path && path !== `/${hub}/${summary.slug}`) permanentRedirect(path)

  const video = safeHref(resource.videoURL)
  return (
    <article className="container section interior resource-detail">
      <Link className="text-link" href={`/${hub}`}>
        ← Back to {hubNames[hub]}
      </Link>
      <PageIntro
        label={resourceTypeLabel(summary.resourceType)}
        title={summary.title}
      >
        <p>{summary.excerpt}</p>
      </PageIntro>
      <ResourceMeta resource={summary} />
      <ContentImage value={resource.cover} />
      <RichText value={resource.body} />
      {video && (
        <a className="button" href={video}>
          Watch the video
        </a>
      )}
    </article>
  )
}
