import "../lib/server/load-env"
import { getServerPayload } from "../lib/server/payload"
import { samplePicks } from "../lib/site/sample-picks"

// Adds the two sample picks, unpublished, so the Picks pages can be
// previewed from /admin. Existing picks with the same slug are left alone.
async function main() {
  if (process.env.SEED_PICKS !== "true") {
    throw new Error("Set SEED_PICKS=true to add the unpublished sample picks.")
  }

  const payload = await getServerPayload()
  try {
    for (const pick of samplePicks) {
      const existing = await payload.count({
        collection: "picks",
        where: { slug: { equals: pick.slug } },
      })
      if (existing.totalDocs > 0) {
        console.info(`Skipped ${pick.slug}: it already exists.`)
        continue
      }
      await payload.create({
        collection: "picks",
        data: { ...pick, published: false },
      })
      console.info(`Added ${pick.slug} (unpublished).`)
    }
  } finally {
    await payload.destroy()
  }
}

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(
      "Seeding sample picks failed:",
      error instanceof Error ? error.message : "Unexpected failure."
    )
    process.exit(1)
  })
