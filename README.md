# Sara Gibby · Night Signal

The public site and owned content/subscriber platform for Sara Gibby: clear answers for your biggest tech decisions.

## Architecture

- **Next.js + TypeScript** serve the site and API on Vercel.
- **Payload** runs the private editor at `/admin` in the same application. Content is not managed in an external CMS.
- **Supabase Postgres** stores content, admin users, consent, subscribers, inquiries, and durable email work.
- **Supabase Storage** supplies S3-compatible persistent media storage.
- A **Heroku worker** processes email outside Vercel request lifetimes. SMTP supplies delivery only, not audience management.
- Legacy Gatsby sources, blog posts, recipe schemas, and media are preserved in [legacy](./legacy), excluded from the new application and deployment uploads.

Paid checkout, customer accounts, course progress, and community membership are not part of this release. Course, community, and shop routes collect interest, not payment.

## Local setup

Use Node 24, following [.node-version](./.node-version). Production uses the `24.x` engine. The dependencies are locked; use `npm ci`.

```sh
npm ci
cp .env.example .env
```

### Draft visual preview

Leave `SITE_PREVIEW=true` to review the design without a database, storage account, or email credentials.

```sh
npm run dev
```

Open `http://localhost:3000`. This is an explicitly labeled draft, not a working signup service. Preview must not manufacture successful submissions or claim email delivery. Preview is excluded from indexing.

### Connected application

Configure an isolated development database, storage buckets, application secret, canonical origin, and email transport before setting `SITE_PREVIEW=false`. Never point local tests or Vercel previews at production data.

Use a unique, randomly generated `PAYLOAD_SECRET` of sufficient length. Store it in deployment secret settings; do not put credentials in Git, logs, browser environment variables, or screenshots. Changing it invalidates existing signed links/sessions and needs an operational rollout.

```sh
npm run generate:types
npm run generate:importmap
npm run migrate
npm run dev
```

Run the email worker in a separate terminal with the same database and server-side configuration:

```sh
npm run worker
```

Before exposing the admin on a production domain, run `npm run bootstrap:admin` in a trusted server shell with `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD` supplied through a secure temporary environment. Use a unique password of at least 16 characters, not a command-line argument or committed configuration. The command uses a database lock, refuses to run when any user already exists, and closes its database connection. Remove the bootstrap credentials immediately afterward. There is no public admin-account signup. Subsequent users are created by an authenticated administrator.

## Environment and infrastructure

Start from [.env.example](./.env.example). Variable values must be supplied separately for development, preview, and production.

| Area | Configuration |
| --- | --- |
| Site | `SITE_PREVIEW`, `NEXT_PUBLIC_SITE_URL`, `SITE_URL` (same canonical origin) |
| Data/authentication | `DATABASE_URL`, `PAYLOAD_SECRET`, `EMAIL_SIGNING_SECRET` (independent random secret, at least 32 characters) |
| Persistent media | `SUPABASE_STORAGE_URL`, `SUPABASE_STORAGE_SERVICE_KEY`, `SUPABASE_S3_ENDPOINT`, `SUPABASE_S3_REGION`, `SUPABASE_S3_ACCESS_KEY_ID`, `SUPABASE_S3_SECRET_ACCESS_KEY`, `SUPABASE_PUBLIC_MEDIA_BUCKET`, `SUPABASE_PRIVATE_KIT_BUCKET` |
| Delivery | `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM`, `CONTACT_EMAIL` |

`SITE_URL` is the canonical origin, such as `https://saragibby.com`, with no path, query, credentials, or fragment. Set `NEXT_PUBLIC_SITE_URL` to that same origin when supplying it; mismatched origins are rejected. Production requires HTTPS. No secret may use the `NEXT_PUBLIC_` prefix.

The backend and standalone worker load the root `.env` natively. Injected environment values take precedence. `SMTP_PASSWORD` and the `SUPABASE_*` names above are the actual supported names, not `SMTP_PASS` or generic `S3_*` aliases.

Use a Postgres connection pool sized for the Vercel plan and Heroku database connection limit. Configure certificate-verified TLS; do not solve certificate failures by disabling verification globally. Storage credentials should have access only to the required buckets. Public images and private kit files have different access requirements.

On Supabase, use the transaction pooler (port 6543) for Vercel with
`DATABASE_POOL_MAX=3` to bound connections across serverless instances. Payload's
adapter reserves a connection, so a pool of one deadlocks initialization.
Use the session pooler (port 5432) for migrations, offline admin bootstrap, and the
long-running worker. The bootstrap needs at least three connections because it holds a
session advisory lock while creating the administrator. The two hosts' database URLs
therefore intentionally differ by pooler port.

For Supabase, set `DATABASE_CA_CERT` to the complete PEM CA certificate downloaded from Database Settings, on both Vercel and the worker. Multiline environment values are supported. The adapter verifies the certificate and hostname; connection-string SSL parameters cannot override that policy. Only exact loopback hosts disable TLS for local development.

The local filesystem on Vercel is not durable storage. Keep uploaded files in Supabase Storage, with public access limited to genuinely published imagery. Do not expose starter-kit or draft files by making every bucket public.

The public media collection is explicitly public: an image uploaded there remains accessible even if its only reference is a draft. Do not upload confidential draft imagery to it. Starter Kit assets use a separate protected collection and private bucket. Removing a public page does not revoke already shared public image URLs.

## Editing and publishing

Use `/admin` for site settings, homepage sections, public pages, resources, offerings, media, and subscriber operations. Keep unfinished material in draft.

- Provide meaningful alt text on images.
- Use stable resource slugs; changing an already published URL needs an explicit redirect.
- Only publish claims, biographies, project links, and tutorial URLs Sara has approved.
- Leave offerings explicitly marked as previews/waitlists until they are actually available.
- Review legal pages with the owner before publication. Draft notices are not legal policies.
- Record explicit owner approval on the legal pages before enabling live capture. Publishing alone is not consent or owner approval.
- Keep necessary information in body text, not handwritten decoration.
- Verify public pages after publishing; draft previews must not appear in public listings or sitemaps.

### Positioning and voice

The promise is **clear answers for your biggest tech decisions**. Sara provides independent, honest CTO-level guidance to non-technical founders, small business owners, startup teams, and solo founders. Help readers decide, understand, or avoid a costly mistake. You do not need to be technical to make great tech decisions.

Write like Sara is explaining something to a smart friend over coffee. Lead with the recommendation, then the reason. Use short sentences, second person, and plain words. Explain technical terms the first time they appear. Be confident, warm, and useful, never salesy or judgmental. Humor belongs in asides and examples, not in security, money, legal guidance, forms, or error messages. Avoid buzzwords, guarantees, em dashes as pauses, and employer or confidential details. Keep claims factual and never promise outcomes.

### Visual system

Use Manrope for headlines and body text, Caveat only for occasional handwritten notes, and IBM Plex Mono for uppercase eyebrows, tags, and numbers. Ink Black (`#0D1B2A`) is the page background; Blue Spruce (`#0E7C6B`) is for actions; Desert Sand (`#EDCBB1`) is for featured moments; Rosewood (`#B7245C`) is for handwriting on light surfaces. On dark surfaces use Spruce Light (`#5FBFAE`) for accents and Rosewood Light (`#D94C83`) for large handwritten notes. Bone (`#F5EFE9`) is the primary text color. Do not use Rosewood for buttons or errors. Reserve graph paper for worksheets and teaching materials, never page backgrounds or long text.

Keep the layout calm and direct: a 1200px content width, 24px side gutters, generous section spacing, and flat cards. Use one featured Sand card per section at most. Keep one primary action per section. Handwritten notes are lowercase, at least 24px, under eight words, and never carry essential information. Use warm, natural owner photography; do not use generic stock imagery.

### Homepage content

The homepage leads with the tech-decision promise, then shows who needs a senior second opinion, translates common jargon, and offers four ways to get help: the free CTO Starter Kit, playbooks and a course, Ask Sara, and async reviews. The worksheet section uses the graph-paper treatment. Follow with Sara's experience and ventures, real questions with straight answers, and one clear next step. Keep planned materials labeled as planned until the owner approves the actual kit and delivery.

The same copy and visual rules apply to Ask Sara, courses, playbooks, reviews, the Margin Notes newsletter, social posts, and video. A publishable piece should help someone make a tech decision, put the recommendation early, make sense to a non-technical founder, and offer one clear next step.

The portrait in the initial design is cropped from the owner-supplied homepage PDF. Replace it with the original high-resolution image before launch if available.

Venture logos are local copies of the official Rise & Shore `/rise-shore-logo.svg`
and TaxDedux `/tax-dedux-logo.png` assets, retrieved from their respective websites.
They retain their original colors on a light backing for contrast against the dark cards.

## Email operations

For a content-only production launch, set `EMAIL_DELIVERY_ENABLED=false` on both hosts.
This keeps the CMS and published site live while replacing signup/inquiry forms with
availability notices and returning HTTP 503 from their APIs before storing submissions.
SMTP sends are also blocked, including admin password resets. Keep the worker stopped.
After configuring and testing delivery and approving privacy information, set this flag
to `true`, redeploy, and start the worker. Never enable sends merely to complete a build.

On a newly migrated database, `PUBLISH_LAUNCH_CONTENT=true npm run publish:launch-content`
publishes the initial homepage and informational pages from the supplied mockup.
It refuses to overwrite an existing homepage, preserves existing page/offer slugs,
does not invent tutorials or legal policies, and leaves products marked as previews.
Review subsequent changes in the owned admin.

The pending audience addition can be applied to an existing homepage with
`UPDATE_HOMEPAGE_AUDIENCES=true npx tsx src/scripts/add-marketing-audience.ts`
using the target environment configuration. This preserves existing audience tags
and does nothing if the new tag already exists. Run only when ready to publish;
deploying code alone does not update existing CMS content.

The pending biography rewrite uses the shared copy in `src/lib/site/biography.ts`.
When ready to publish, run `UPDATE_BIOGRAPHY=true npx tsx src/scripts/update-biography.ts`
with the target configuration to update the homepage story and About page together.
Review the current CMS copy first; this replaces those two bodies, not other fields.

The pending brand and homepage rewrite uses `src/lib/site/homepage-design.ts`.
When ready to publish, run
`UPDATE_HOMEPAGE_DESIGN=true npx tsx src/scripts/update-homepage-design.ts`
with the intended target configuration. It updates the site navigation, homepage
copy, shared biography, and offering descriptions while preserving existing
offering availability, legal approval, signup, and delivery settings. Review CMS
content first; this is an explicit copy update and does not deploy code.

Forms must persist submissions before acknowledging them and queue delivery durably. A successful form response is not proof of inbox delivery.

- Keep lead-magnet requests separate from consent to ongoing marketing.
- Require confirmation before ongoing newsletter or waitlist sends.
- Enforce suppression for unsubscribe, hard bounce, and complaint events.
- Never send to an entire subscriber collection without rechecking consent and suppression at send time.
- Inspect failed jobs and transport responses in admin/logs; repair the cause before retrying.
- SMTP cannot guarantee exactly-once delivery after an ambiguous connection failure. Investigate uncertain sends instead of blindly resending.
- Respect provider limits and warm up a new sending domain gradually.
- Do not enable production sends until SPF, DKIM, DMARC, sender identity, reply handling, and provider feedback/webhook verification are configured and tested.

Administrators compose newsletter campaigns in Payload. The authenticated endpoint `/api/newsletter/campaigns/[campaignId]` supplies test-send and scheduling actions; review its request validation before wiring an additional custom admin button or automation. Do not invoke jobs directly over HTTP or bypass campaign consent checks.

The delivery provider is intentionally not chosen on Sara's behalf. Provider-specific bounce/complaint integration is a launch gate, not a reason to ignore feedback.

`/api/delivery-events` explicitly returns 503 until a provider-specific adapter with signature verification is implemented. Do not configure production sends while this feedback path remains unavailable. Background job execution over the web is disabled; only the standalone worker runs jobs.

## Validation

```sh
npm run typecheck
npm run lint
npm test
SITE_PREVIEW=true npm run build
npm run test:e2e
```

Browser tests start a separate local server on port 3100 (override with `E2E_PORT`). Stop another development server for this workspace before running them, since Next.js locks its development output directory. If Playwright reports that Chromium is missing, install its supported browser with `npx playwright install chromium` and rerun. Unit tests do not require a production database.

The Postgres integration suite is opt-in and refuses every database except the explicitly named local test database:

```sh
createdb saragibby_rebuild_7425ea14_test
BACKEND_INTEGRATION_DATABASE_URL=postgresql://localhost/saragibby_rebuild_7425ea14_test npm test -- tests/unit/backend-integration.test.ts
```

Apply the committed migrations to that isolated database before the first run, using temporary test secrets and no production credentials. Never remove the database allowlist merely to point tests at a deployed database.

The production dependency graph includes narrow security overrides for DOMPurify, Happy DOM, and esbuild. Preserve compatibility checks when updating Payload/Lexical/Drizzle and remove overrides when upstream ranges include the patched versions. `npm audit` is a dependency check, not a complete application security assessment.

Before launch, test the connected application in an isolated deployed environment: migrations, private access, publish/preview behavior, storage persistence, confirmation/delivery/unsubscribe, rate limits, worker restarts, retry behavior, and signed links. Check keyboard navigation and contrast in addition to automated accessibility tests. Measure mobile LCP and CLS on production-like hosting; local build success does not establish field performance.

## Deployment

1. Choose explicit Vercel, Heroku, and Supabase project resources. Do not reuse or overwrite another application's database or buckets.
2. Set Node 24 and configure server-side variables on the web application and worker. Keep `SITE_PREVIEW=false` for production.
3. Use a separate deployment preview database and storage location. Vercel preview URLs must not send production newsletters.
4. Back up the target database. Review and apply committed migrations once before deploying code that needs them. Never use development schema push against production.
5. Build the web application with `npm run build`. Vercel must have compatible database networking/TLS and storage access.
6. Deploy the same revision to a Heroku worker using [Procfile](./Procfile). Scale the worker deliberately. Its runtime includes `tsx`; do not remove it as a development-only dependency.
7. Verify `/api/health`, a real public page, admin login, persistent uploads, and a complete email journey. Readiness is not a substitute for checking the mail worker.
8. Configure monitoring for worker downtime, database connections, queue age, failed jobs, SMTP rejection, and backup failures.
9. Cut over DNS only after the owner approves content/assets, privacy/terms, and end-to-end checks.

No hosting resources or DNS changes are provisioned automatically by this repository.

### Recovery

Keep the previous deployment available before cutover. Take database backups and verify restores to an isolated database. Coordinate application rollback with schema compatibility; rolling back JavaScript alone does not undo a migration or email send. Never point a rollback at a destructively altered database without a reviewed restore procedure.

Known legacy blog and recipe URLs return **410 Gone**. Unknown URLs return **404**. The old `/sw.js` route retires Gatsby offline registrations and only known Gatsby/Workbox precaches, so returning visitors can load the new site.

## Production launch gates

- Approved original logo assets and portrait, with provenance confirmed.
- Actual Starter Kit materials and video.
- Approved public content, consulting claims, and project/tutorial links.
- Approved privacy, terms, disclaimer, retention, and contact details.
- An email provider, verified sender/domain, feedback integration, and demonstrated delivery/suppression.
- Real hosting configuration, database migrations, backup/restore verification, and deployed end-to-end checks.

Do not treat a draft design, test SMTP server, or successful production build as evidence these gates have been completed.
