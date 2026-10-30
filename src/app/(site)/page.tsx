import Link from "next/link"
import Image from "next/image"
import { access } from "node:fs/promises"
import path from "node:path"
import { SignupForm } from "@/components/site/forms"
import { RichText } from "@/components/site/rich-text"
import {
  contentItems,
  getDocuments,
  getGlobal,
  homeCopy,
  preview,
  record,
  safeHref,
  selectedDocuments,
  text,
} from "@/lib/site/content"
import {
  homepageDesign,
  homepageAudienceFocuses,
  homepageFaqHeading,
  homepageOfferingEyebrows,
  homepageQuestions,
  homepageOfferings,
  techTranslations,
} from "@/lib/site/homepage-design"

export default async function Home() {
  const [home, offerings] = await Promise.all([
    getGlobal("homepage"),
    getDocuments("offerings"),
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
    homepageDesign.audienceItems
  )
  const kitContents = contentItems(
    home,
    "kitContents",
    homepageDesign.kitContents.map((label) => ({ label }))
  )
  const industries = contentItems(
    home,
    "industries",
    homepageDesign.industries.map((label) => ({ label }))
  )
  const sectors = contentItems(
    home,
    "audiences",
    homepageDesign.audiences.map((label) => ({ label }))
  )
  const ventures = contentItems(home, "ventures", homepageDesign.ventures)
  const copy = (key: string, draft: string, fallback = "") =>
    text(home[key], preview ? draft : fallback)
  const story = record(home.story)
  const featuredOfferings = selectedDocuments(
    home.offerings,
    offerings.length
      ? offerings
      : homepageOfferings.map((offer) => ({ ...offer, _status: "published" }))
  )
  const consultingDescription = copy(
    "consultingDescription",
    homepageDesign.consultingDescription
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
            <p className="small muted">{homepageDesign.kitDescription}</p>
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
          {contentItems(
            home,
            "credibilityItems",
            homepageDesign.credibilityItems.map((label) => ({ label }))
          ).map((item, index) => (
            <p key={index}>
              {text(item.label)
                .split(
                  /(25\+? years|Multi-startup|AI strategy|University of Michigan)/
                )
                .map((part, partIndex) =>
                  partIndex % 2 === 1 ? (
                    <strong key={partIndex}>{part}</strong>
                  ) : (
                    part
                  )
                )}
            </p>
          ))}
        </div>
      </div>
      <section className="container section">
        <p className="eyebrow">Sound familiar?</p>
        <h2 className="section-title">
          {copy("audienceHeading", homepageDesign.audienceHeading)}
        </h2>
        <p className="handwriting">you’re in good company</p>
        <div className="grid three audience-grid">
          {audienceItems.map((item, index) => (
            <article className="card" key={index}>
              <div>
                <p className="eyebrow">
                  {homepageAudienceFocuses[index] || text(item.title)}
                </p>
                <h3>{text(item.title)}</h3>
                <p className="muted">{text(item.description)}</p>
              </div>
              {index === audienceItems.length - 1 && (
                <div className="audience-next-step">
                  <p className="eyebrow">Build on what works</p>
                  <p className="muted">
                    You do not have to start over. Get a clear view of what to
                    keep, where reliability or security needs attention, and
                    which parts need experienced hands. Make your next hire or
                    handoff with a practical plan, not a bigger pile of tools.
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
      <section className="container section translator">
        <p className="eyebrow">The tech translator</p>
        <h2 className="section-title">What they said, and what they meant.</h2>
        <p className="handwriting">bookmark this for your next dev meeting</p>
        <div className="grid four translator-grid">
          {techTranslations.map((translation) => (
            <article className="translator-card" key={translation.theySaid}>
              <p className="eyebrow">They said</p>
              <h3>{translation.theySaid}</h3>
              <p className="eyebrow">They meant</p>
              <p>{translation.theyMeant}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="container section offerings">
        <div className="section-heading">
          <div>
            <p className="eyebrow">How it works</p>
            <h2 className="section-title">
              {copy("offeringsHeading", homepageDesign.offeringsHeading)}
            </h2>
          </div>
          <p className="handwriting">no question is too basic</p>
        </div>
        {featuredOfferings.length ? (
          <div className="grid four">
            {featuredOfferings.map((offer) => (
              <article
                className={
                  offer.slug === "starter-kit" ? "card featured" : "card"
                }
                key={text(offer.slug)}
              >
                <p className="eyebrow">
                  {text(
                    homepageOfferingEyebrows[text(offer.slug)],
                    text(offer.availability, "Preview")
                  )}
                </p>
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
        ) : (
          <div className="empty-state">
            Offering details are not published yet.{" "}
            <Link href="/start-here">Start here</Link>.
          </div>
        )}
        <div className="consulting-strip">
          <p>
            <strong>Independent, on purpose.</strong> I don’t run a dev shop or
            take referral fees, so the only thing I’m selling you is good
            advice.
          </p>
          <p className="handwriting">no upsell. pinky promise.</p>
        </div>
      </section>
      <section className="kit-band">
        <div className="container section kit-section">
          <div>
            <p className="eyebrow">Inside the free CTO Starter Kit</p>
            <h2>{copy("kitHeading", homepageDesign.kitHeading)}</h2>
            <ul className="check-list">
              {kitContents.map((item, index) => (
                <li key={index}>
                  {text(item.label)
                    .split(
                      /(A decision guide|A tech stack checklist|A 10-minute video)/
                    )
                    .map((part, partIndex) =>
                      partIndex % 2 === 1 ? (
                        <strong key={partIndex}>{part}</strong>
                      ) : (
                        part
                      )
                    )}
                </li>
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
            <p className="eyebrow">Checklist 03 · Before you sign</p>
            <h3>Is this dev quote any good?</h3>
            {[
              "Is the scope written down?",
              "Do you own the code?",
              "Does “done” include testing?",
            ].map((question) => (
              <div className="worksheet-row" key={question}>
                <span>{question}</span>
                <span className="score">Y / N</span>
              </div>
            ))}
            <p className="handwriting">ask these before you sign anything</p>
          </div>
        </div>
      </section>
      <section className="container section story-section">
        <div>
          <p className="eyebrow">Hi, I’m Sara</p>
          <h2>{text(story.heading, homepageDesign.storyHeading)}</h2>
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
            <h3>Good advice should be on your side.</h3>
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
          {copy("experienceHeading", homepageDesign.experienceHeading)}
        </h2>
        <p className="lead">
          {copy("experienceDescription", homepageDesign.experienceDescription)}
        </p>
        <div className="grid two">
          <div>
            <h3>Industries I’ve worked in</h3>
            <div className="tags">
              {industries.map((item, index) => (
                <span key={index}>{text(item.label)}</span>
              ))}
            </div>
            <p className="expertise-list">
              AI strategy · Development · Architecture design and reviews ·
              Engineering leadership · Teaching
            </p>
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
                I make the same calls I help you make
              </p>
            )}
          </div>
        </div>
      </section>
      <section className="container section faq-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">From Ask Sara</p>
            <h2>{homepageFaqHeading}</h2>
          </div>
          <Link className="text-link" href="/community">
            See Ask Sara <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="grid three">
          {homepageQuestions.map((item) => (
            <article className="card faq-card" key={item.question}>
              <p className="eyebrow">Question</p>
              <h3>{item.question}</h3>
              <p className="muted">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="container closing-band">
        <div className="closing-inner">
          <div>
            <p className="eyebrow">Independent advice, no jargon</p>
            <h2>{copy("closingHeading", homepageDesign.closingHeading)}</h2>
            <p>
              {copy("closingDescription", homepageDesign.closingDescription)}
            </p>
          </div>
          <SignupForm source="home-closing" />
        </div>
      </section>
    </>
  )
}
