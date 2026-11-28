import type { Metadata } from "next"
import { ToolkitHub } from "@/components/site/resource-hubs"
import { PageIntro } from "@/components/site/shell"
import { getResources, preview } from "@/lib/site/content"
import { resourcesForHub, toResourceSummaries } from "@/lib/site/resources"
import { bestieName } from "@/lib/site/site-navigation"

const intro =
  "Templates, checklists, prompts and how-to guides you can use today. Free, practical, bestie-approved."

export const metadata: Metadata = {
  title: "The Small Business Tech Toolkit",
  description: `${bestieName}. ${intro}`,
  ...(preview ? { robots: { index: false, follow: false } } : {}),
}

export default async function Toolkit() {
  const resources = await getResources()
  return (
    <div className="container section interior">
      <PageIntro label="Toolkit" title="The Small Business Tech Toolkit">
        <p>{intro}</p>
      </PageIntro>
      <ToolkitHub
        resources={resourcesForHub(toResourceSummaries(resources), "toolkit")}
      />
    </div>
  )
}
