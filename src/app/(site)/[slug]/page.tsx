import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { InquiryForm, SignupForm } from "@/components/site/forms"
import { PageIntro } from "@/components/site/shell"
import { RichText } from "@/components/site/rich-text"
import { VentureLogo } from "@/components/site/venture-logo"
import { biography } from "@/lib/site/biography"
import { homepageDesign } from "@/lib/site/homepage-design"
import {
  contactEmail,
  kitLabel,
  kitName,
  linkedInUrl,
} from "@/lib/site/site-navigation"
import { getDocument, getPage, preview, text } from "@/lib/site/content"

const routes: Record<
  string,
  { title: string; label: string; description: string }
> = {
  "start-here": {
    title: "Start with the situation you’re in.",
    label: "Start here",
    description:
      "You do not need to be technical to make a good tech decision. Start with what’s in front of you, and take the first step.",
  },
  about: {
    title: "25 years of building software. Now I help you decide.",
    label: "Hi, I’m Sara",
    description:
      "Engineer, engineering leader, startup founder, and teacher. I help founders and small businesses make clear, independent tech decisions.",
  },
  now: {
    title: "Always building.",
    label: "Now",
    description:
      "A look at current work, experiments, and the things getting my attention.",
  },
  resources: {
    title: "Playbooks and practical guides.",
    label: "Playbooks",
    description:
      "Clear guides to tech decisions, hiring, vendors, and using AI in real businesses.",
  },
  course: {
    title: "Learn to make better tech decisions.",
    label: "Course · In development",
    description:
      "Practical lessons for making confident technology decisions without becoming a developer.",
  },
  community: {
    title: "Ask Sara.",
    label: "Ask Sara · In development",
    description:
      "Bring a real question about tech, AI, hiring, or vendors. Get a clear answer without judgment.",
  },
  shop: {
    title: "Less starting from scratch.",
    label: "Shop · In development",
    description:
      "Practical templates and AI toolkits are in the works. There are no products for sale yet.",
  },
  "build-with-me": {
    title: "Have a tech decision reviewed.",
    label: "Independent reviews",
    description:
      "Get an independent review of your tech stack, architecture, code, vendor proposal, or AI plan.",
  },
  newsletter: {
    title: `The ${kitLabel}.`,
    label: kitLabel,
    description:
      "A practical guide to the tech decisions every founder faces. Request the kit, and choose whether you would also like ongoing email.",
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
  const legal = ["privacy", "terms", "disclaimer"].includes(slug)
  const [page, offering] = await Promise.all([
    legal ? getPage(slug) : Promise.resolve(undefined),
    getDocument("offerings", slug),
  ])
  const bodyApproved = Boolean(page && (!legal || page.ownerApproved === true))
  const interest = ["course", "community", "shop"].includes(slug)
    ? (slug as "course" | "community" | "shop")
    : null
  return (
    <div className={`container section interior page-${slug}`}>
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
            <>
              <p className="handwriting form-note">
                start with the messy version. that’s fine.
              </p>
              <InquiryForm />
            </>
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

const startPaths = [
  {
    situation: "You’re starting with AI",
    description:
      "You know AI could save you time, but not where to begin, which tools to trust, or what’s safe to share with them.",
    steps: [
      "Pick one repetitive task, not a chatbot",
      "Check whether the time saved is worth the cost",
      "Make sure the data is safe to use",
    ],
  },
  {
    situation: "You got a quote or proposal",
    description:
      "An agency, developer, or vendor sent a price and a timeline. You need to know whether it’s fair before you sign.",
    steps: [
      "Ask for an itemized scope, assumptions, and exclusions",
      "Confirm who owns the code and what support costs",
      "Compare quotes against the same requirements",
    ],
  },
  {
    situation: "You built something with AI",
    description:
      "You built something impressive with AI or no-code tools. Now you need to know whether it will hold up with real users.",
    steps: [
      "List what breaks, and what you’re afraid to change",
      "Check security, data, and who can get in",
      "Decide when it’s time to bring in real developers",
    ],
  },
]

const ventureSites: Record<string, string> = {
  "Rise & Shore": "https://riseandshore.com",
  TaxDedux: "https://taxdedux.com",
}

const nowUpdated = { iso: "2026-11-22", label: "November 22, 2026" }

function DraftContent({ slug }: { slug: string }) {
  if (slug === "about")
    return (
      <div className="about">
        <section className="about-story">
          <div>
            <div className="prose">
              <h2>Across startups and enterprise.</h2>
              <p>
                I’ve worked as an engineer, engineering leader, consultant, and
                teacher, and founded and led technology at several startups.
              </p>
              <p>{biography[0]}</p>
            </div>
            <article className="card about-roles">
              <p className="eyebrow">Roles</p>
              <ul className="check-list">
                <li>Multi-startup tech founder</li>
                <li>Engineering and product team leader</li>
                <li>Architecture, AI strategy, and code reviewer</li>
                <li>
                  Founder of Rise &amp; Shore, technical co-founder of TaxDedux
                </li>
              </ul>
            </article>
          </div>
          <figure className="about-photo">
            <Image
              className="portrait"
              src="/images/sara-speaking.jpg"
              alt="Sara Gibby speaking on stage, smiling and gesturing with a slide clicker in hand"
              width={1000}
              height={1249}
              sizes="(max-width: 760px) 100vw, 40vw"
              priority
            />
            <figcaption className="handwriting">
              building is only half the fun. the other half is teaching.
            </figcaption>
          </figure>
        </section>
        <section className="about-facts">
          <article className="worksheet about-teaching">
            <p className="eyebrow">Teaching</p>
            <ul className="check-list">
              <li>Taught AI at the University of Michigan</li>
              <li>Taught in classrooms from middle schools to universities</li>
              <li>
                Helped working professionals build software engineering skills
              </li>
            </ul>
            <p className="handwriting">no question too basic. ever.</p>
          </article>
          <div className="about-industries">
            <p className="eyebrow">Industries</p>
            <div className="tags">
              {homepageDesign.industries.map((industry) => (
                <span key={industry}>{industry}</span>
              ))}
            </div>
            <Link className="text-link" href="/now">
              See what I’m building now <span>→</span>
            </Link>
          </div>
        </section>
      </div>
    )
  if (slug === "start-here")
    return (
      <>
        <p className="handwriting start-note">
          pick the one that feels a little too familiar.
        </p>
        <div className="grid three">
          {startPaths.map(({ situation, description, steps }) => (
            <article className="card start-path" key={situation}>
              <h2>{situation}</h2>
              <p className="muted">{description}</p>
              <ul className="check-list">
                {steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
              <Link className="text-link" href="/newsletter">
                Get the free {kitName} <span>→</span>
              </Link>
            </article>
          ))}
        </div>
      </>
    )
  if (slug === "newsletter")
    return (
      <div className="card">
        <h2>A small kit for a real first step.</h2>
        <ul className="check-list">
          {homepageDesign.kitContents.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="small muted">
          Planned contents. Final assets and delivery are awaiting approval.
          Ongoing marketing is optional and separate from your kit request.
        </p>
      </div>
    )
  if (slug === "now")
    return (
      <>
        <p className="small muted now-updated">
          Last updated <time dateTime={nowUpdated.iso}>{nowUpdated.label}</time>
        </p>
        <div className="grid two">
          {homepageDesign.ventures.map(({ title, role, description }) => (
            <article className="card" key={title}>
              <VentureLogo name={title} />
              <p className="eyebrow">{role}</p>
              <h2>{title}</h2>
              <p className="muted">{description}</p>
              <a className="text-link" href={ventureSites[title]}>
                Visit {title} <span>→</span>
              </a>
            </article>
          ))}
        </div>
      </>
    )
  if (slug === "build-with-me")
    return (
      <section className="course-layout review-layout">
        <div className="prose">
          <h2>Independent, on purpose.</h2>
          <p>
            AI strategy, architecture design and reviews, code reviews, vendor
            proposal reviews, and engineering leadership advice. Start with an
            honest conversation about the problem, not a tool looking for a use
            case.
          </p>
          <p>There is no development work to sell and no referral fees.</p>
          <p className="contact-line">
            Prefer to talk first? Email{" "}
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a> or{" "}
            <a href={linkedInUrl}>connect on LinkedIn</a>.
          </p>
        </div>
        <div className="worksheet review-sheet">
          <p className="eyebrow">What you can send</p>
          <h3>Have this reviewed</h3>
          {[
            "Your tech stack",
            "Architecture or system design",
            "A codebase",
            "A vendor proposal or quote",
            "An AI plan",
          ].map((item) => (
            <div className="worksheet-row" key={item}>
              <span>{item}</span>
              <span className="lesson-box" aria-hidden="true" />
            </div>
          ))}
          <p className="handwriting">honest answers, even the awkward ones.</p>
        </div>
      </section>
    )
  if (slug === "course")
    return (
      <section className="course-layout">
        <div className="prose">
          <h2>A course for the tech calls you can’t hand off.</h2>
          <p>
            A practical, self-paced course for founders and small business
            owners. You won’t learn to code. You’ll learn to ask the right
            questions and judge the answers.
          </p>
          <p className="eyebrow">Made for</p>
          <div className="tags">
            {homepageDesign.audiences.map((audience) => (
              <span key={audience}>{audience}</span>
            ))}
          </div>
          <p className="small muted">
            Looking for something to use today? The{" "}
            <Link href="/resources">playbooks</Link> are short, standalone
            guides.
          </p>
        </div>
        <div className="worksheet course-syllabus">
          <p className="eyebrow">Draft syllabus</p>
          <h3>What we’ll cover</h3>
          {[
            "Build, buy, or hire: choosing the right path",
            "Reading a quote, a proposal, or a timeline",
            "Choosing AI tools without the hype",
            "Hiring your first developer or agency",
          ].map((lesson) => (
            <div className="worksheet-row" key={lesson}>
              <span>{lesson}</span>
              <span className="lesson-box" aria-hidden="true" />
            </div>
          ))}
          <p className="handwriting">
            written in pencil. tell me what’s missing.
          </p>
        </div>
      </section>
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
