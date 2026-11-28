import { notFound } from "next/navigation"
import { NextResponse } from "next/server"
import { getResource } from "@/lib/site/content"
import { resourcePath, toResourceSummary } from "@/lib/site/resources"

// /resources was retired for /learn and /toolkit. Old item links move, with
// a 301, to wherever that item lives now. Unknown slugs are a plain 404, not
// a cached permanent redirect, so a slug published later still resolves.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const resource = await getResource(slug)
  const summary = resource && toResourceSummary(resource)
  const path = summary && resourcePath(summary)
  if (!path) notFound()
  return NextResponse.redirect(new URL(path, request.url), 301)
}
