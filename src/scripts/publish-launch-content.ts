import "../lib/server/load-env"
import { getServerPayload } from "../lib/server/payload"

import { biography as story } from "../lib/site/biography"
import {
  homepageDesign,
  homepageOfferings,
  siteDescription,
} from "../lib/site/homepage-design"
import { siteNavigation } from "../lib/site/site-navigation"
import { richText } from "../lib/site/plain-rich-text"

async function main() {
  if (process.env.PUBLISH_LAUNCH_CONTENT !== "true") {
    throw new Error(
      "Set PUBLISH_LAUNCH_CONTENT=true to publish the initial mockup content."
    )
  }
  const payload = await getServerPayload()
  try {
    const home = await payload.findGlobal({ slug: "homepage", depth: 0 })
    if (home.hero?.heading) {
      throw new Error(
        "Homepage already contains content. Refusing to overwrite editor changes."
      )
    }

    await payload.updateGlobal({
      slug: "site",
      data: {
        siteName: "Sara Gibby",
        siteDescription,
        navigation: siteNavigation,
      },
    })

    const pages = [
      { slug: "about", title: homepageDesign.storyHeading, paragraphs: story },
      {
        slug: "start-here",
        title: "Start with the decision in front of you.",
        paragraphs: [
          "You do not need to be technical to make a thoughtful technology decision. Start with the problem, then choose the next step.",
          "Ask the hard questions while the stakes are small: who needs this, what do they do today, and what would a better way change?",
          "Compare your options before you buy, hire, or build. Get the scope, ownership, assumptions, and next steps in plain language.",
          "The free CTO Starter Kit is in preparation. Downloads and email signup are not open yet.",
        ],
      },
      {
        slug: "now",
        title: "Always building.",
        paragraphs: [
          "Rise & Shore: AI-powered search for beach vacation rentals, booked direct with local agencies.",
          "TaxDedux: AI tax planning and deduction discovery for freelancers, the self-employed, and CPA firms.",
          "Alongside these ventures, I consult with founders and teams bringing AI into real products.",
        ],
      },
      {
        slug: "build-with-me",
        title: "Have a tech decision reviewed.",
        paragraphs: [
          "Get an independent review of your tech stack, architecture, code, vendor proposal, or AI plan.",
          "You will get clear recommendations and practical next steps, without jargon or judgment.",
          "Reviews and online inquiries are not open yet while services and email delivery are being prepared.",
        ],
      },
      {
        slug: "newsletter",
        title: "The free CTO Starter Kit",
        paragraphs: [
          "The CTO Starter Kit is in preparation: a guide to the decisions founders face, a plain-English checklist, and a short video walkthrough.",
          "Email signup and kit delivery are not open yet. Ongoing marketing will be optional and separate from a kit request.",
        ],
      },
      {
        slug: "course",
        title: "Learn to make better tech decisions.",
        paragraphs: [
          "Practical courses and playbooks for making confident technology decisions without becoming a developer.",
          "The course is in development. Enrollment and email signup are not open yet.",
        ],
      },
      {
        slug: "community",
        title: "Ask Sara.",
        paragraphs: [
          "Bring a real question about tech, AI, hiring, or vendors. Get a clear answer without judgment.",
          "Ask Sara is in development. Submissions are not open yet.",
        ],
      },
      {
        slug: "shop",
        title: "Playbooks and practical tools.",
        paragraphs: [
          "Decision guides, checklists, and practical tools are in the works.",
          "There are no products for sale yet. Email signup is not open yet.",
        ],
      },
    ]
    for (const page of pages) {
      const existing = await payload.find({
        collection: "pages",
        where: { slug: { equals: page.slug } },
        limit: 1,
      })
      if (existing.totalDocs) {
        console.info(`Keeping existing page: ${page.slug}`)
        continue
      }
      await payload.create({
        collection: "pages",
        data: {
          slug: page.slug,
          title: page.title,
          body: richText(page.paragraphs),
          ownerApproved: false,
          _status: "published",
        },
      })
    }

    const offeringData = homepageOfferings
    const offerings: number[] = []
    for (const offer of offeringData) {
      const existing = await payload.find({
        collection: "offerings",
        where: { slug: { equals: offer.slug } },
        limit: 1,
      })
      const document =
        existing.docs[0] ??
        (await payload.create({
          collection: "offerings",
          data: { ...offer, availability: "preview", _status: "published" },
        }))
      offerings.push(document.id)
    }
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
        offerings,
        kitHeading: homepageDesign.kitHeading,
        kitContents: homepageDesign.kitContents.map((label) => ({
          label: `Planned: ${label}`,
        })),
        story: { heading: homepageDesign.storyHeading, body: richText(story) },
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
      "Initial public content published. Legal approval, capture, and delivery remain disabled."
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
