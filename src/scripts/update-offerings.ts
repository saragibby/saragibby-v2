import "../lib/server/load-env"
import { getServerPayload } from "../lib/server/payload"
import { homepageOfferings } from "../lib/site/homepage-design"

async function main() {
  if (process.env.UPDATE_OFFERINGS !== "true") {
    throw new Error(
      "Set UPDATE_OFFERINGS=true to update the published offering copy."
    )
  }

  const payload = await getServerPayload()
  try {
    for (const offer of homepageOfferings) {
      const existing = await payload.find({
        collection: "offerings",
        where: { slug: { equals: offer.slug } },
        limit: 1,
      })
      const current = existing.docs[0]
      if (current) {
        await payload.update({
          collection: "offerings",
          id: current.id,
          data: {
            title: offer.title,
            description: offer.description,
            ctaLabel: offer.ctaLabel,
            ctaDestination: offer.ctaDestination,
          },
        })
      } else {
        await payload.create({
          collection: "offerings",
          data: {
            ...offer,
            availability: "preview",
            _status: "published",
          },
        })
      }
    }
    console.info(
      "Offering copy updated. Existing availability settings were preserved."
    )
  } finally {
    await payload.destroy()
  }
}

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(
      "Offering update failed:",
      error instanceof Error ? error.message : "Unexpected failure."
    )
    process.exit(1)
  })
