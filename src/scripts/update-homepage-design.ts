import "../lib/server/load-env"
import { getServerPayload } from "../lib/server/payload"
import {
  homepageDesign,
  homepageOfferings,
  siteDescription,
} from "../lib/site/homepage-design"
import { siteNavigation } from "../lib/site/site-navigation"
import { biography } from "../lib/site/biography"
import { richText } from "../lib/site/plain-rich-text"

async function main() {
  if (process.env.UPDATE_HOMEPAGE_DESIGN !== "true") {
    throw new Error(
      "Set UPDATE_HOMEPAGE_DESIGN=true to update the published homepage copy."
    )
  }

  const payload = await getServerPayload()
  try {
    const home = await payload.findGlobal({ slug: "homepage", depth: 0 })
    if (!home.hero?.heading) {
      throw new Error(
        "Homepage has no published hero content. Use the initial launch publisher first."
      )
    }

    const offeringIds: number[] = []
    for (const offer of homepageOfferings) {
      const existing = await payload.find({
        collection: "offerings",
        where: { slug: { equals: offer.slug } },
        limit: 1,
      })
      const current = existing.docs[0]
      const data = {
        title: offer.title,
        description: offer.description,
        ctaLabel: offer.ctaLabel,
        ctaDestination: offer.ctaDestination,
      }
      const document = current
        ? await payload.update({
            collection: "offerings",
            id: current.id,
            data,
          })
        : await payload.create({
            collection: "offerings",
            data: {
              ...offer,
              availability: "preview",
              _status: "published",
            },
          })
      offeringIds.push(document.id)
    }

    await payload.updateGlobal({
      slug: "site",
      data: { siteDescription, navigation: siteNavigation },
    })
    await payload.updateGlobal({
      slug: "homepage",
      data: {
        hero: homepageDesign.hero,
        alwaysBuilding: homepageDesign.alwaysBuilding,
        credibilityItems: homepageDesign.credibilityItems.map((label) => ({
          label,
        })),
        audienceHeading: homepageDesign.audienceHeading,
        audienceItems: homepageDesign.audienceItems,
        offerings: offeringIds,
        kitHeading: homepageDesign.kitHeading,
        kitContents: homepageDesign.kitContents.map((label) => ({
          label: `Planned: ${label}`,
        })),
        story: {
          heading: homepageDesign.storyHeading,
          body: richText(biography),
        },
        audiences: homepageDesign.audiences.map((label) => ({ label })),
        consultingDescription: homepageDesign.consultingDescription,
        experienceHeading: homepageDesign.experienceHeading,
        experienceDescription: homepageDesign.experienceDescription,
        industries: homepageDesign.industries.map((label) => ({ label })),
        ventures: homepageDesign.ventures,
        closingHeading: homepageDesign.closingHeading,
        closingDescription: homepageDesign.closingDescription,
      },
    })
    console.info(
      "Homepage copy updated. Existing availability, legal approval, signup, and delivery settings were preserved."
    )
  } finally {
    await payload.destroy()
  }
}

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(
      "Homepage update failed:",
      error instanceof Error ? error.message : "Unexpected failure."
    )
    process.exit(1)
  })
