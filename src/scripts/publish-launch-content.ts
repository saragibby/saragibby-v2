import '../lib/server/load-env'
import { getServerPayload } from '../lib/server/payload'

import { biography as story } from '../lib/site/biography'
import { richText } from '../lib/site/plain-rich-text'

async function main() {
  if (process.env.PUBLISH_LAUNCH_CONTENT !== 'true') {
    throw new Error('Set PUBLISH_LAUNCH_CONTENT=true to publish the initial mockup content.')
  }
  const payload = await getServerPayload()
  try {
    const home = await payload.findGlobal({ slug: 'homepage', depth: 0 })
    if (home.hero?.heading) {
      throw new Error('Homepage already contains content. Refusing to overwrite editor changes.')
    }

    await payload.updateGlobal({
      slug: 'site',
      data: {
        siteName: 'Sara Gibby',
        siteDescription: 'Practical AI systems for building something real, a few hours at a time.',
        navigation: [
          { label: 'Start Here', href: '/start-here' },
          { label: 'Resources', href: '/resources' },
          { label: 'About', href: '/about' },
          { label: 'Build With Me', href: '/build-with-me' },
        ],
      },
    })

    const pages = [
      { slug: 'about', title: 'A builder, before anything else.', paragraphs: story },
      {
        slug: 'start-here', title: 'A little time. A real first step.',
        paragraphs: [
          'Pick one problem. Choose something you understand, for someone you can actually talk to.',
          'Test before you build. Ask the hard questions while the stakes are small: who needs this, what do they do today, and would they pay for a better way?',
          'Make room for progress. Find a repeatable block of time. Build one useful thing, then learn from it.',
          'The free Starter Kit is in preparation. Downloads and email signup are not open yet.',
        ],
      },
      {
        slug: 'now', title: 'Always building.',
        paragraphs: [
          'Rise & Shore: AI-powered search for beach vacation rentals, booked direct with local agencies.',
          'TaxDedux: AI tax planning and deduction discovery for freelancers, the self-employed, and CPA firms.',
          'Alongside these ventures, I consult with founders and teams bringing AI into real products.',
        ],
      },
      {
        slug: 'build-with-me', title: 'Bring AI into real work.',
        paragraphs: [
          'AI strategy, development, architecture design and reviews, and engineering leadership for founders and teams bringing AI into real products.',
          'From first commit to scale, as an engineer, engineering leader, consultant, and teacher.',
          'Online inquiries are not open yet while email delivery is being connected.',
        ],
      },
      {
        slug: 'newsletter', title: 'Your 10 hours start here.',
        paragraphs: [
          'The Starter Kit is in preparation: tested AI prompts, an idea scorecard, and a short video walkthrough.',
          'Email signup and kit delivery are not open yet. Ongoing marketing will be optional and separate from a kit request.',
        ],
      },
      {
        slug: 'course', title: 'The 10 Hour Founder',
        paragraphs: [
          'A practical path from idea to launch, designed to fit around the rest of your life.',
          'The course is in development. Enrollment and email signup are not open yet.',
        ],
      },
      {
        slug: 'community', title: 'Progress is better together.',
        paragraphs: [
          'A future gathering place for builders making steady progress, a few hours at a time.',
          'The community is in development. Membership and email signup are not open yet.',
        ],
      },
      {
        slug: 'shop', title: 'Less starting from scratch.',
        paragraphs: [
          'Practical templates and AI toolkits are in the works.',
          'There are no products for sale yet. Email signup is not open yet.',
        ],
      },
    ]
    for (const page of pages) {
      const existing = await payload.find({
        collection: 'pages', where: { slug: { equals: page.slug } }, limit: 1,
      })
      if (existing.totalDocs) {
        console.info(`Keeping existing page: ${page.slug}`)
        continue
      }
      await payload.create({
        collection: 'pages',
        data: {
          slug: page.slug,
          title: page.title,
          body: richText(page.paragraphs),
          ownerApproved: false,
          _status: 'published',
        },
      })
    }

    const offeringData = [
      { slug: 'starter-kit', title: 'The free Starter Kit', description: 'Tested prompts, an idea scorecard, and a short walkthrough. In preparation; downloads are not available yet.', ctaLabel: 'See what is coming', ctaDestination: '/start-here' },
      { slug: 'shop', title: 'Templates and AI toolkits', description: 'Practical tools for less starting from scratch. No products are for sale yet.', ctaLabel: 'Preview the shop', ctaDestination: '/shop' },
      { slug: 'course', title: 'The 10 Hour Founder', description: 'A practical path from idea to launch, designed to fit around the rest of your life. In development.', ctaLabel: 'Explore the course', ctaDestination: '/course' },
      { slug: 'community', title: 'Build alongside other builders', description: 'A space for steady progress, useful questions, and showing your work. In development.', ctaLabel: 'Explore the community', ctaDestination: '/community' },
    ]
    const offerings: number[] = []
    for (const offer of offeringData) {
      const existing = await payload.find({
        collection: 'offerings', where: { slug: { equals: offer.slug } }, limit: 1,
      })
      const document = existing.docs[0] ?? await payload.create({
        collection: 'offerings', data: { ...offer, availability: 'preview', _status: 'published' },
      })
      offerings.push(document.id)
    }
    await payload.updateGlobal({
      slug: 'homepage',
      data: {
        hero: {
          eyebrow: 'the 10 hour founder',
          heading: 'Build an AI-powered side business in 10 hours a week.',
          description: 'Practical systems, templates, and lessons from a builder and consultant with 25+ years shipping software for startups and enterprises. No hype, honest results, and a few surprises along the way.',
        },
        alwaysBuilding: 'AI products for fintech, real estate, and travel, and consulting for founders bringing AI into their business.',
        credibilityItems: [
          '25+ years building software', 'Taught AI at the University of Michigan',
          'Built and advised startups across industries', 'Founded a Girls Who Code club',
        ].map((label) => ({ label })),
        audienceHeading: "You don't need to quit your job to start building.",
        audienceItems: [
          { title: 'You have an idea and a day job', description: 'The idea keeps coming back. The calendar keeps saying no. You need a way to move it forward in small, real steps.' },
          { title: 'AI feels powerful and overwhelming', description: 'New tools every week, and no clear place to start. You want the few workflows that actually matter.' },
          { title: 'You can find 10 hours, not 40', description: 'Evenings and a weekend block. That is enough when the system does the heavy lifting.' },
        ],
        offeringsHeading: 'Start small. Go as deep as you want.',
        offerings,
        kitHeading: 'Your first AI win, this week.',
        kitContents: [
          'Planned: tested prompts from real building work',
          'Planned: an idea scorecard to pick the one worth your 10 hours',
          'Planned: a short walkthrough to put it all together',
        ].map((label) => ({ label })),
        story: { heading: 'I build after hours, and I show you exactly how.', body: richText(story) },
        audiences: ['Fintech and tax', 'Real estate and investing', 'Travel and hospitality', 'Publishing', 'Small business', 'Marketing tech and AI tooling'].map((label) => ({ label })),
        consultingDescription: 'AI strategy, development, architecture design and reviews, and engineering leadership for founders and teams bringing AI into real products.',
        experienceHeading: '25 years across startups and enterprise.',
        experienceDescription: 'From first commit to scale, as an engineer, engineering leader, consultant, and teacher.',
        industries: ['Fintech', 'Real estate', 'AI and developer tools', 'Travel', 'Education', 'Automotive', 'Marketing'].map((label) => ({ label })),
        ventures: [
          { title: 'Rise & Shore', role: 'Travel and hospitality - Founder', description: 'AI-powered search for beach vacation rentals, booked direct with local agencies.' },
          { title: 'TaxDedux', role: 'Fintech and tax - Technical co-founder', description: 'AI tax planning and deduction discovery for freelancers, the self-employed, and CPA firms.' },
        ],
        closingHeading: 'Your 10 hours start here.',
        closingDescription: 'A small start, this week. Practical systems for building something real.',
      },
    })
    console.info('Initial public content published. Legal approval, capture, and delivery remain disabled.')
  } finally {
    await payload.destroy()
  }
}

main().then(() => process.exit(0)).catch((error: unknown) => {
  console.error('Launch content publication failed:', error instanceof Error ? error.message : 'Unexpected failure.')
  process.exit(1)
})
