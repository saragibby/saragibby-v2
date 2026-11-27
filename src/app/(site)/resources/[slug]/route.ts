import { NextResponse } from "next/server"
import { getResource } from "@/lib/site/content"
import { resourcePath, toResourceSummary } from "@/lib/site/resources"

// /resources was retired for /learn and /toolkit. Old item links move, with
// a 301, to wherever that item lives now. Anything else goes to /toolkit,
// the same place /resources itself redirects (see next.config.ts).
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const resource = await getResource(slug)
  const summary = resource && toResourceSummary(resource)
  const path = (summary && resourcePath(summary)) ?? "/toolkit"
  return NextResponse.redirect(new URL(path, request.url), 301)
}
