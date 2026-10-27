import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { InquiryForm, SignupForm } from "@/components/site/forms"
import { PageIntro } from "@/components/site/shell"
import { RichText } from "@/components/site/rich-text"
import { VentureLogo } from "@/components/site/venture-logo"
import {
  getDocument,
  getPage,
  homeDraft,
  preview,
  text,
} from "@/lib/site/content"

const routes: Record<
  string,
  { title: string; label: string; description: string }
> = {
  "start-here": {
    title: "A little time. A real first step.",
    label: "Start here",
    description:
      "You don’t need every tool or a perfect plan. Start with one problem, one idea, and a small block of time.",
  },
  about: {
    title: "A builder, before anything else.",
    label: "Hi, I’m Sara",
    description:
      "Software, systems, and making useful things. After hours, and over the long haul.",
  },
  now: {
    title: "Always building.",
    label: "Now",
    description:
      "A look at current work, experiments, and the things getting my attention.",
  },
  resources: {
    title: "Useful things. No filler.",
    label: "Resources",
    description: "Practical guides and tutorials for building with AI.",
  },
  course: {
    title: "The 10 Hour Founder",
    label: "Course · In development",
    description:
      "A practical path from idea to launch, built around a real life and a limited calendar.",
  },
  community: {
    title: "Progress is better together.",
    label: "Community · In development",
    description:
      "A future gathering place for builders making steady progress, a few hours at a time.",
  },
  shop: {
    title: "Less starting from scratch.",
    label: "Shop · In development",
    description:
      "Practical templates and AI toolkits are in the works. There are no products for sale yet.",
  },
  "build-with-me": {
    title: "Bring AI into real work.",
    label: "Build with me",
    description:
      "Tell me what you’re building, where you’re stuck, and what a useful next step would look like.",
  },
  newsletter: {
    title: "Your 10 hours start here.",
    label: "The free Starter Kit",
    description:
      "A practical starting point for your next idea. Request the kit, and choose whether you’d also like ongoing email.",
  },
  privacy: {
    title: "Privacy",
    label: "The fine print",
    description:
      "Owner-approved privacy information will appear here before launch.",
  },
  terms: {
    title: "Terms",
    label: "The fine print",
    description: "Owner-approved terms will appear here before launch.",
  },
  disclaimer: {
    title: "Disclaimer",
    label: "The fine print",
    description:
      "Owner-approved disclaimer information will appear here before launch.",
  },
}

type Props = { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return {
    title: routes[slug]?.title ?? "Page",
    ...(preview ? { robots: { index: false, follow: false } } : {}),
  }
}

export default async function PublicPage({ params }: Props) {
  const { slug } = await params
  const route = routes[slug]
  if (!route || slug === "resources") notFound()
  const [page, offering] = await Promise.all([
    getPage(slug),
    getDocument("offerings", slug),
  ])
  const legal = ["privacy", "terms", "disclaimer"].includes(slug)
  const bodyApproved = Boolean(page && (!legal || page.ownerApproved === true))
  const interest = ["course", "community", "shop"].includes(slug)
    ? (slug as "course" | "community" | "shop")
    : null
  return (
    <div className="container section interior">
      <PageIntro
        label={
          offering
            ? `${text(offering.title)} · ${text(offering.availability)}`
            : route.label
        }
        title={text(page?.title, text(offering?.title, route.title))}
      >
        <p>{text(offering?.description, route.description)}</p>
      </PageIntro>
      {bodyApproved ? (
        <RichText value={page?.body} />
      ) : legal ? (
        <div className="notice">
          <h2>Not yet published</h2>
          <p>
            This page is awaiting owner review and approval. This is a draft
            notice, not legal policy. Public launch and collection of personal
            information require the approved policy.
          </p>
        </div>
      ) : !preview ? (
        <div className="empty-state">
          <p>Full page content has not been published yet.</p>
        </div>
      ) : (
        <DraftContent slug={slug} />
      )}
      {!legal && (
        <div className="page-action">
          {interest ? (
            <>
              <h2>Be first to hear what’s next.</h2>
              <p className="muted">
                This is an interest list, not enrollment or a purchase.
                Availability and details will be shared when ready.
              </p>
              <SignupForm
                source={`${slug}-interest`}
                interest={interest}
                button="Keep me posted"
              />
            </>
          ) : slug === "build-with-me" ? (
            <InquiryForm />
          ) : ["start-here", "newsletter"].includes(slug) ? (
            <SignupForm source={slug} />
          ) : (
            <Link className="button" href="/start-here">
              Find your starting point
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

function DraftContent({ slug }: { slug: string }) {
  if (slug === "about")
    return (
      <div className="prose">
        <h2>I build after hours, and I show you exactly how.</h2>
        <p>{homeDraft.story}</p>
        <p>{homeDraft.teaching}</p>
        <Link className="text-link" href="/now">
          See what I’m building now →
        </Link>
      </div>
    )
  if (slug === "start-here")
    return (
      <div className="grid three">
        {[
          [
            "01",
            "Pick one problem",
            "Choose something you understand, for someone you can actually talk to.",
          ],
          [
            "02",
            "Test before you build",
            "Use the idea scorecard to ask the hard questions while the stakes are small.",
          ],
          [
            "03",
            "Make room for progress",
            "Find a repeatable block of time. Build one useful thing, then learn from it.",
          ],
        ].map(([number, title, copy]) => (
          <article className="card" key={number}>
            <p className="eyebrow">{number}</p>
            <h2>{title}</h2>
            <p className="muted">{copy}</p>
          </article>
        ))}
      </div>
    )
  if (slug === "newsletter")
    return (
      <div className="card">
        <h2>A small kit for a real first step.</h2>
        <ul className="check-list">
          <li>50 tested AI prompts</li>
          <li>An idea scorecard</li>
          <li>A short video walkthrough</li>
        </ul>
        <p className="small muted">
          Planned contents. Final assets and delivery are awaiting approval.
          Ongoing marketing is optional and separate from your kit request.
        </p>
      </div>
    )
  if (slug === "now")
    return (
      <div className="grid two">
        <article className="card">
          <VentureLogo name="Rise & Shore" />
          <p className="eyebrow">Travel and hospitality</p>
          <h2>Rise &amp; Shore</h2>
          <p className="muted">
            AI-powered search for beach vacation rentals, booked direct with
            local agencies.
          </p>
        </article>
        <article className="card">
          <VentureLogo name="TaxDedux" />
          <p className="eyebrow">Fintech and tax</p>
          <h2>TaxDedux</h2>
          <p className="muted">
            AI tax planning and deduction discovery for freelancers, the
            self-employed, and CPA firms.
          </p>
        </article>
      </div>
    )
  if (slug === "build-with-me")
    return (
      <div className="card">
        <p className="eyebrow">Where I can help</p>
        <h2>Strategy meets shipping.</h2>
        <p className="muted">
          AI strategy, development, architecture design and reviews, and
          engineering leadership. Start with an honest conversation about the
          problem, not a tool looking for a use case.
        </p>
      </div>
    )
  return (
    <div className="notice">
      <h2>Still on the workbench.</h2>
      <p>
        Details are being developed. There is no checkout, paid access, or
        member account yet. Leave your email below if you’d like to hear when
        there’s something ready to share.
      </p>
    </div>
  )
}
