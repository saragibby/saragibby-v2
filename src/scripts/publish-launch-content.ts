import "../lib/server/load-env"
import { getServerPayload } from "../lib/server/payload"
import { homepageOfferings } from "../lib/site/homepage-design"

async function main() {
  if (process.env.PUBLISH_LAUNCH_CONTENT !== "true") {
    throw new Error(
      "Set PUBLISH_LAUNCH_CONTENT=true to publish the initial mockup content."
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
      if (existing.docs[0]) continue
      await payload.create({
        collection: "offerings",
        data: { ...offer, availability: "preview", _status: "published" },
      })
    }
    console.info(
      "Initial offerings published. Informational pages are maintained in code."
    )
  } finally {
    await payload.destroy()
  }
}

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(
      "Launch content publication failed:",
      error instanceof Error ? error.message : "Unexpected failure."
    )
    process.exit(1)
  })
