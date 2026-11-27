import Link from "next/link"
import Image from "next/image"
import { access } from "node:fs/promises"
import path from "node:path"
import { SignupForm } from "@/components/site/forms"
import { TranslatorSpotlight } from "@/components/site/translator-spotlight"
import { biography } from "@/lib/site/biography"
import {
  getDocuments,
  preview,
  safeHref,
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
import { kitName } from "@/lib/site/site-navigation"

export default async function Home() {
  const offerings = await getDocuments("offerings")
  let hasPortrait = false
  try {
    await access(path.join(process.cwd(), "public/images/sara-portrait.jpg"))
    hasPortrait = true
  } catch {
    /* Missing owner asset is shown explicitly. */
  }
  const title = homepageDesign.hero.heading
  const audienceItems = homepageDesign.audienceItems
  const kitContents = homepageDesign.kitContents.map((label) => ({ label }))
  const industries = homepageDesign.industries.map((label) => ({ label }))
  const sectors = homepageDesign.audiences.map((label) => ({ label }))
  const ventures = homepageDesign.ventures
  const featuredOfferings = homepageOfferings.flatMap((defaultOffer) => {
    // The kit card is homepage copy, so it always comes from the code defaults.
    if (defaultOffer.slug === "starter-kit") return [defaultOffer]
    const published = offerings.find(
      (offer) => text(offer.slug) === defaultOffer.slug
    )
    if (published) return [published]
    return preview
      ? [{ ...defaultOffer, availability: "Preview" }]
      : []
  })
  return (
    <>
      <section className="container hero">
        <div className="hero-copy">
          <h1>{title}</h1>
          <p className="handwriting hero-note">{homepageDesign.hero.note}</p>
          <p className="hero-support">{homepageDesign.hero.supporting}</p>
          <p className="lead">{homepageDesign.hero.description}</p>
          <div className="hero-signup">
            <p className="small muted">{homepageDesign.kitDescription}</p>
            <SignupForm source="home-hero" />
            <p className="handwriting">free, and no spam. promise.</p>
          </div>
        </div>
        <div className="hero-visual">
          {hasPortrait ? (
            <Image
              className="portrait"
              src="/images/sara-portrait.jpg"
              alt="Sara Gibby"
              width={800}
              height={1000}
              sizes="(max-width: 760px) 100vw, 42vw"
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
            <p>{homepageDesign.alwaysBuilding}</p>
          </aside>
        </div>
      </section>
      <div className="credibility-strip">
        <div className="container credibility">
          {homepageDesign.credibilityItems.map((label, index) => (
            <p key={index}>
              {text(label)
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
          {homepageDesign.audienceHeading}
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
        <TranslatorSpotlight />
        <div className="grid four translator-grid">
          {techTranslations.map((translation) => (
            <article className="translator-card" key={translation.theySaid}>
              <p className="eyebrow">What they said</p>
              <h3>{translation.theySaid}</h3>
              <p className="eyebrow">What they meant</p>
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
              {homepageDesign.offeringsHeading}
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
                {offer.slug === "starter-kit" && (
                  <ul className="check-list">
                    {kitContents.map((item) => (
                      <li key={item.label}>
                        <KitItem label={item.label} />
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  className="text-link"
                  href={
                    safeHref(offer.ctaDestination) ??
                    `/${["course", "community"].includes(text(offer.slug)) ? text(offer.slug) : "start-here"}`
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
            <p className="eyebrow">Inside the free {kitName}</p>
            <h2>{homepageDesign.kitHeading}</h2>
            <p>{homepageDesign.kitPromise}</p>
            <ul className="check-list">
              {kitContents.map((item, index) => (
                <li key={index}>
                  <KitItem label={item.label} />
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
            <p className="eyebrow">The Sara Test · Before you sign up</p>
            <h3>Can I trust this tool?</h3>
            {[
              "Where does my stuff go?",
              "Who else can get in?",
              "Can I break up with it?",
            ].map((question) => (
              <div className="worksheet-row" key={question}>
                <span>{question}</span>
                <span className="lesson-box" aria-hidden="true" />
              </div>
            ))}
            <p className="handwriting">ask these before you sign up for anything</p>
          </div>
        </div>
      </section>
      <section className="container section story-section">
        <div>
          <p className="eyebrow">Hi, I’m Sara</p>
          <h2>{homepageDesign.storyHeading}</h2>
          <p className="muted">{biography[0]}</p>
          <p className="muted">{biography[1]}</p>
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
            <p className="muted">{homepageDesign.consultingDescription}</p>
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
          {homepageDesign.experienceHeading}
        </h2>
        <p className="lead">
          {homepageDesign.experienceDescription}
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
            <h2>{homepageDesign.closingHeading}</h2>
            <p>{homepageDesign.closingDescription}</p>
          </div>
          <SignupForm source="home-closing" />
        </div>
      </section>
    </>
  )
}

function KitItem({ label }: { label: string }) {
  return label
    .split(/(A one-hour worksheet|The Sara Test|A “Safe to start” one-pager)/)
    .map((part, index) =>
      index % 2 === 1 ? <strong key={index}>{part}</strong> : part
    )
}
