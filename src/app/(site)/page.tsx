import Link from "next/link"
import Image from "next/image"
import { access } from "node:fs/promises"
import path from "node:path"
import { SignupForm } from "@/components/site/forms"
import { ContentImage, RichText } from "@/components/site/rich-text"
import {
  contentItems,
  getDocuments,
  getGlobal,
  homeCopy,
  preview,
  record,
  resourceType,
  safeHref,
  selectedDocuments,
  text,
} from "@/lib/site/content"

const audience = [
  [
    "You have an idea and a day job",
    "The idea keeps coming back. The calendar keeps saying no. You need a way to move it forward in small, real steps.",
  ],
  [
    "AI feels powerful and overwhelming",
    "New tools every week, and no clear place to start. You want the few workflows that actually matter.",
  ],
  [
    "You can find 10 hours, not 40",
    "Evenings and a weekend block. That is enough when the system does the heavy lifting.",
  ],
]

export default async function Home() {
  const [home, resources, offerings, kit] = await Promise.all([
    getGlobal("homepage"),
    getDocuments("resources"),
    getDocuments("offerings"),
    getGlobal("starterKit"),
  ])
  let hasPortrait = false
  try {
    await access(path.join(process.cwd(), "public/images/sara-portrait.jpg"))
    hasPortrait = true
  } catch {
    /* Missing owner asset is shown explicitly. */
  }
  const title = homeCopy(home, "title")
  const hero = record(home.hero)
  const portrait = record(hero.portrait)
  const portraitURL = safeHref(portrait.url)
  const audienceItems = contentItems(
    home,
    "audienceItems",
    audience.map(([title, description]) => ({ title, description }))
  )
  const kitContents = contentItems(home, "kitContents", [
    { label: "50 tested prompts from real building work" },
    { label: "An idea scorecard to pick the one worth your 10 hours" },
    { label: "A 10 minute walkthrough to put it all together" },
  ])
  const industries = contentItems(
    home,
    "industries",
    [
      "Fintech",
      "Real estate",
      "AI and developer tools",
      "Travel",
      "Education",
      "Automotive",
      "Marketing",
    ].map((label) => ({ label }))
  )
  const sectors = contentItems(
    home,
    "audiences",
    [
      "Fintech and tax",
      "Real estate and investing",
      "Travel and hospitality",
      "Publishing",
      "Small business",
    ].map((label) => ({ label }))
  )
  const ventures = contentItems(home, "ventures", [
    {
      title: "Rise & Shore",
      role: "Travel and hospitality · Founder",
      description:
        "AI-powered search for beach vacation rentals, booked direct with local agencies.",
    },
    {
      title: "TaxDedux",
      role: "Fintech and tax · Technical co-founder",
      description:
        "AI tax planning and deduction discovery for freelancers, the self-employed, and CPA firms.",
    },
  ])
  const copy = (key: string, draft: string, fallback = "") =>
    text(home[key], preview ? draft : fallback)
  const story = record(home.story)
  const featuredResources = selectedDocuments(home.featuredResources, resources)
  const featuredOfferings = selectedDocuments(home.offerings, offerings)
  const consultingDescription = copy(
    "consultingDescription",
    "AI strategy, development, architecture design and reviews, and engineering leadership for founders and teams bringing AI into real products."
  )
  if (!title)
    return (
      <section className="container section holding">
        <p className="eyebrow">Sara Gibby</p>
        <h1>Something thoughtful is in the works.</h1>
        <p className="lead">
          The new site is being prepared. Please check back for published
          resources and availability.
        </p>
      </section>
    )
  return (
    <>
      <section className="container hero">
        <div className="hero-copy">
          <p className="handwriting hero-note">{homeCopy(home, "eyebrow")}</p>
          <h1>{title}</h1>
          <p className="lead">{homeCopy(home, "description")}</p>
          <div className="hero-signup">
            <p className="small muted">
              {text(
                kit.description,
                preview
                  ? "Starter Kit preview: 50 tested prompts, an idea scorecard, and a 10 minute video."
                  : "Get the free Starter Kit."
              )}
            </p>
            <SignupForm source="home-hero" />
            <p className="handwriting">free, and no spam. promise.</p>
          </div>
        </div>
        <div className="hero-visual">
          {portraitURL || hasPortrait ? (
            <Image
              className="portrait"
              src={portraitURL || "/images/sara-portrait.jpg"}
              alt={text(portrait.alt, "Sara Gibby")}
              width={800}
              height={1000}
              sizes="(max-width: 760px) 100vw, 42vw"
              unoptimized={Boolean(portraitURL)}
              priority
            />
          ) : (
            <div className="portrait portrait-placeholder">
              <span className="eyebrow">Behind the build</span>
              <strong>Hi, I’m Sara.</strong>
              <p>Owner-approved portrait needed.</p>
            </div>
          )}
          <aside className="building-card">
            <p className="eyebrow">Always building</p>
            <p>{homeCopy(home, "alwaysBuilding")}</p>
          </aside>
        </div>
      </section>
      <div className="credibility-strip">
        <div className="container credibility">
          {contentItems(home, "credibilityItems", [
            { label: "25+ years building software" },
            { label: "Taught AI at the University of Michigan" },
            { label: "Built and advised startups across industries" },
            { label: "Founded a Girls Who Code club" },
          ]).map((item, index) => (
            <p key={index}>{text(item.label)}</p>
          ))}
        </div>
      </div>
      <section className="container section">
        <p className="eyebrow">Is this you?</p>
        <h2 className="section-title">
          {copy(
            "audienceHeading",
            "You don't need to quit your job to start building.",
            "Make room for your next idea."
          )}
        </h2>
        <div className="grid three">
          {audienceItems.map((item, index) => (
            <article className="card" key={index}>
              <p className="eyebrow">{String(index + 1).padStart(2, "0")}</p>
              <h3>{text(item.title)}</h3>
              <p className="muted">{text(item.description)}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="container section offerings">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Ways to work with me</p>
            <h2 className="section-title">
              {copy(
                "offeringsHeading",
                "Start free. Go as deep as you want.",
                "Find your next step."
              )}
            </h2>
          </div>
          <p className="handwriting">most people start with the kit</p>
        </div>
        {featuredOfferings.length ? (
          <div className="grid three">
            {featuredOfferings.map((offer) => (
              <article
                className={
                  offer.slug === "starter-kit" ? "card featured" : "card"
                }
                key={text(offer.slug)}
              >
                <p className="eyebrow">{text(offer.availability, "Preview")}</p>
                <h3>{text(offer.title)}</h3>
                <p>{text(offer.description)}</p>
                <Link
                  className="text-link"
                  href={
                    safeHref(offer.ctaDestination) ??
                    `/${["course", "community", "shop"].includes(text(offer.slug)) ? text(offer.slug) : "start-here"}`
                  }
                >
                  {text(offer.ctaLabel, "Learn more")} →
                </Link>
              </article>
            ))}
          </div>
        ) : preview ? (
          <>
            <div className="grid three">
              <article className="card featured">
                <p className="eyebrow">Free · Starter Kit</p>
                <h3>
                  One small start.
                  <br />A real first win.
                </h3>
                <p>
                  Prompts, an idea scorecard, and a short video to help you get
                  started.
                </p>
                <Link className="button" href="/newsletter">
                  Explore the kit
                </Link>
              </article>
              <article className="card">
                <p className="eyebrow">In development</p>
                <h3>Toolkits</h3>
                <p className="muted">
                  Ready-made templates and AI assistants for the work that keeps
                  coming back.
                </p>
                <Link className="text-link" href="/shop">
                  Preview the shop <span aria-hidden="true">↗</span>
                </Link>
              </article>
              <article className="card">
                <p className="eyebrow">Course preview</p>
                <h3>The 10 Hour Founder</h3>
                <p className="muted">
                  A practical path from idea to launch, designed to fit around
                  the rest of your life.
                </p>
                <Link className="text-link" href="/course">
                  See what’s coming <span aria-hidden="true">↗</span>
                </Link>
              </article>
            </div>
            <article className="card community-card">
              <div>
                <p className="eyebrow">Community preview</p>
                <h3>Build alongside other builders.</h3>
                <p className="muted">
                  A space for steady progress, useful questions, and showing
                  your work.
                </p>
              </div>
              <Link className="text-link" href="/community">
                Join the interest list <span aria-hidden="true">→</span>
              </Link>
            </article>
          </>
        ) : (
          <div className="empty-state">
            Offering details are not published yet.{" "}
            <Link href="/start-here">Start here</Link>.
          </div>
        )}
        <div className="consulting-strip">
          <p>
            Bringing AI into your business? Let’s find where it fits, and build
            it together.
          </p>
          <Link className="text-link" href="/build-with-me">
            Build With Me <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
      <section className="container section kit-section">
        <div>
          <p className="eyebrow">Inside the free Starter Kit</p>
          <h2>
            {copy(
              "kitHeading",
              "Your first AI win, this week.",
              "A practical place to start."
            )}
          </h2>
          <ul className="check-list">
            {kitContents.map((item, index) => (
              <li key={index}>{text(item.label)}</li>
            ))}
          </ul>
          {preview && (
            <p className="small muted">
              Planned contents. Final assets and delivery require owner
              approval.
            </p>
          )}
          <SignupForm source="home-kit" />
        </div>
        <div className="worksheet">
          <p className="eyebrow">Worksheet 01 · Idea scorecard</p>
          <h3>Score your idea in 15 minutes.</h3>
          {[
            "Do people already pay for this?",
            "Can AI do the heavy lifting?",
            "Fits in 10 hours a week?",
          ].map((question) => (
            <div className="worksheet-row" key={question}>
              <span>{question}</span>
              <span className="score">__ / 5</span>
            </div>
          ))}
          <p className="handwriting">start with the one that bugs you most</p>
          <span className="worksheet-foot">
            THE 10 HOUR FOUNDER / A SMALL START
          </span>
        </div>
      </section>
      <section className="container section story-section">
        <div>
          <p className="eyebrow">Hi, I’m Sara</p>
          <h2>
            {text(
              story.heading,
              preview
                ? "I build after hours, and I show you exactly how."
                : "A builder, before anything else."
            )}
          </h2>
          {story.body ? (
            <RichText value={story.body} />
          ) : (
            <>
              <p className="muted">{homeCopy(home, "story")}</p>
              <p className="muted">{homeCopy(home, "teaching")}</p>
            </>
          )}
          <Link className="text-link" href="/about">
            Read my story <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div>
          <p className="eyebrow">Who I build for</p>
          <div className="tags">
            {sectors.map((item, index) => (
              <span key={index}>{text(item.label)}</span>
            ))}
          </div>
          <article className="card consulting-card">
            <p className="eyebrow">Consulting</p>
            <h3>Good ideas need thoughtful systems.</h3>
            <p className="muted">{consultingDescription}</p>
            <Link className="text-link" href="/build-with-me">
              Work with me <span aria-hidden="true">→</span>
            </Link>
          </article>
          <p className="handwriting">
            see what I’m working on at <Link href="/now">/now</Link>
          </p>
        </div>
      </section>
      <section className="container section experience">
        <p className="eyebrow">Experience</p>
        <h2 className="section-title">
          {copy(
            "experienceHeading",
            "25 years across startups and enterprise.",
            "A career spent building."
          )}
        </h2>
        <p className="lead">
          {copy(
            "experienceDescription",
            "From first commit to scale, as an engineer, engineering leader, consultant, and teacher."
          )}
        </p>
        <div className="grid two">
          <div>
            <h3>Industries I’ve worked in</h3>
            <div className="tags">
              {industries.map((item, index) => (
                <span key={index}>{text(item.label)}</span>
              ))}
            </div>
            <p className="muted">{consultingDescription}</p>
          </div>
          <div>
            <h3>Startups I’m building</h3>
            <div className="grid two">
              {ventures.map((venture, index) => (
                <article className="card" key={index}>
                  <h4>{text(venture.title)}</h4>
                  <p className="eyebrow">{text(venture.role)}</p>
                  <p className="muted">{text(venture.description)}</p>
                </article>
              ))}
            </div>
            {ventures.length > 0 && (
              <p className="handwriting">
                every one taught me something I now teach
              </p>
            )}
          </div>
        </div>
      </section>
      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Latest tutorials</p>
            <h2>
              Learn something useful
              <br />
              in 15 minutes.
            </h2>
          </div>
          <Link className="text-link" href="/resources">
            All resources <span aria-hidden="true">→</span>
          </Link>
        </div>
        {featuredResources.length ? (
          <div className="grid three">
            {featuredResources.slice(0, 3).map((resource) => (
              <article className="card" key={text(resource.slug)}>
                <ContentImage value={resource.cover} />
                <p className="eyebrow">{resourceType(resource)}</p>
                <h3>
                  <Link href={`/resources/${text(resource.slug)}`}>
                    {text(resource.title)}
                  </Link>
                </h3>
                <p className="muted">{text(resource.excerpt)}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="eyebrow">Good things take building</span>
            <p>
              No tutorials published yet. When they’re ready, you’ll find
              practical walkthroughs here, not placeholder lessons.
            </p>
          </div>
        )}
      </section>
      <section className="closing-band">
        <div className="container closing-inner">
          <div>
            <p className="eyebrow">A small start, this week</p>
            <h2>
              {copy(
                "closingHeading",
                "Your 10 hours start here.",
                "Start with something small."
              )}
            </h2>
            <p>
              {copy(
                "closingDescription",
                "Grab the free Starter Kit. Add the newsletter if you’d like one idea, one template, and one honest result in your inbox.",
                "Request the Starter Kit and choose whether you’d like ongoing email."
              )}
            </p>
          </div>
          <SignupForm source="home-closing" />
        </div>
      </section>
    </>
  )
}
