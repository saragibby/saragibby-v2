import type { Metadata } from "next"
import { LearnHub } from "@/components/site/resource-hubs"
import { PageIntro } from "@/components/site/shell"
import { getResources, preview } from "@/lib/site/content"
import {
  isPillar,
  resourcesForHub,
  toResourceSummaries,
} from "@/lib/site/resources"
import { bestieName } from "@/lib/site/site-navigation"

const intro =
  "Guides, articles and videos that explain tech in plain English. No question too basic."

export const metadata: Metadata = {
  title: "Learn",
  description: `${bestieName}. ${intro}`,
  ...(preview ? { robots: { index: false, follow: false } } : {}),
}

export default async function Learn({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [resources, params] = await Promise.all([getResources(), searchParams])
  const pillar = isPillar(params.pillar) ? params.pillar : undefined
  return (
    <div className="container section interior">
      <PageIntro label="Learn" title="Learn">
        <p>{intro}</p>
      </PageIntro>
      <LearnHub
        resources={resourcesForHub(toResourceSummaries(resources), "learn")}
        pillar={pillar}
      />
    </div>
  )
}
