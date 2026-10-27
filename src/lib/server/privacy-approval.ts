import type { Payload } from "payload"

export async function hasApprovedPrivacyPolicy(payload: Payload): Promise<boolean> {
  const pages = await payload.find({
    collection: "pages",
    overrideAccess: false,
    limit: 1,
    where: {
      and: [
        { slug: { equals: "privacy" } },
        { _status: { equals: "published" } },
        { ownerApproved: { equals: true } },
      ],
    },
  })
  return pages.totalDocs > 0
}
