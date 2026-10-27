import { notFound } from "next/navigation"
import Link from "next/link"
import { getDocument, resourceType, text, safeHref } from "@/lib/site/content"
import { ContentImage, RichText } from "@/components/site/rich-text"
import { PageIntro } from "@/components/site/shell"

type Props = { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const resource = await getDocument("resources", slug)
  return {
    title: text(resource?.title, "Resource"),
    description: text(resource?.excerpt),
  }
}
export default async function Resource({ params }: Props) {
  const { slug } = await params
  const resource = await getDocument("resources", slug)
  if (!resource) notFound()
  const video = safeHref(resource.videoURL)
  return (
    <article className="container section interior resource-detail">
      <Link className="text-link" href="/resources">
        ← All resources
      </Link>
      <PageIntro label={resourceType(resource)} title={text(resource.title)}>
        <p>{text(resource.excerpt)}</p>
      </PageIntro>
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
