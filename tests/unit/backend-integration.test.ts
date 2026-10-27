import { randomBytes, randomUUID } from 'node:crypto'
import { createLocalReq, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { consumeRateLimit, rateLimitKey } from '../../src/lib/server/rate-limit'
import { signEmailToken } from '../../src/lib/server/tokens'
import { bootstrapFirstAdmin } from '../../src/lib/server/admin-bootstrap'

const databaseURL = process.env.BACKEND_INTEGRATION_DATABASE_URL
const permittedDatabaseURL = 'postgresql://localhost/saragibby_rebuild_7425ea14_test'

describe.skipIf(!databaseURL)('isolated Postgres backend integration', () => {
  let payload: Payload
  const signingSecret = randomBytes(48).toString('hex')
  const runID = randomUUID()
  const email = `backend-${runID}@example.test`
  const rateKey = rateLimitKey('integration', runID, signingSecret)
  let subscriberId: number
  let inquiryId: number | undefined
  let privacyId: number | undefined

  beforeAll(async () => {
    if (databaseURL !== permittedDatabaseURL) {
      throw new Error('Backend integration tests may only use the explicitly isolated local database.')
    }
    vi.stubEnv('DATABASE_URL', databaseURL)
    vi.stubEnv('PAYLOAD_SECRET', randomBytes(48).toString('hex'))
    vi.stubEnv('EMAIL_SIGNING_SECRET', signingSecret)
    vi.stubEnv('SITE_URL', 'http://localhost:3000')
    vi.stubEnv('PAYLOAD_MIGRATING', 'true')
    const { getServerPayload } = await import('../../src/lib/server/payload')
    payload = await getServerPayload()
    const existing = await payload.count({ collection: 'pages', where: { slug: { equals: 'privacy' } }, overrideAccess: true })
    if (existing.totalDocs !== 0) throw new Error('Isolated test database must not contain a privacy page fixture before this suite.')
    const privacy = await payload.create({
      collection: 'pages',
      data: {
        title: 'Integration test privacy policy',
        slug: 'privacy',
        body: { root: { type: 'root', version: 1, children: [
          { type: 'paragraph', version: 1, children: [
            { type: 'text', version: 1, text: 'Isolated test policy, not production legal copy.', format: 0, detail: 0, mode: 'normal', style: '' },
          ], direction: null, format: '', indent: 0, textFormat: 0, textStyle: '' },
        ], direction: null, format: '', indent: 0 } },
        ownerApproved: true,
        _status: 'published',
      },
      overrideAccess: true,
    })
    privacyId = privacy.id
  }, 30_000)

  afterAll(async () => {
    if (payload) {
      if (privacyId) await payload.delete({ collection: 'pages', id: privacyId, overrideAccess: true })
      await payload.db.pool.query(
        `DELETE FROM payload_jobs WHERE input->>'subscriberId' = $1 OR input->>'inquiryId' = $2`,
        [String(subscriberId), String(inquiryId)],
      )
      if (subscriberId) {
        await payload.delete({
          collection: 'subscribers',
          id: subscriberId,
          overrideAccess: true,
        })
      }
      if (inquiryId) {
        await payload.delete({ collection: 'inquiries', id: inquiryId, overrideAccess: true })
      }
      await payload.delete({
        collection: 'suppressions',
        where: { email: { equals: email } },
        overrideAccess: true,
      })
      await payload.db.pool.query('DELETE FROM backend_rate_limits WHERE key_hash = $1', [rateKey])
      await payload.destroy()
    }
    vi.unstubAllEnvs()
  })

  function jsonRequest(path: string, data: object): Request {
    return new Request(`http://localhost:3000${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-real-ip': runID },
      body: JSON.stringify(data),
    })
  }

  it('blocks built-in first-register on an empty database and permits offline bootstrap only once', async () => {
    expect((await payload.count({ collection: 'users', overrideAccess: true })).totalDocs).toBe(0)
    const data = {
      email: `admin-${runID}@example.test`,
      password: randomBytes(24).toString('hex'),
      role: 'admin' as const,
    }
    const endpoints = payload.collections.users.config.endpoints
    if (!endpoints) throw new Error('Users authentication endpoints are missing.')
    const endpoint = endpoints.find(
      (endpoint) => endpoint.path === '/first-register' && endpoint.method === 'post',
    )
    if (!endpoint) throw new Error('First-register endpoint is missing.')
    const req = await createLocalReq({}, payload)
    req.data = data
    req.routeParams = { collection: 'users' }
    await expect(endpoint.handler(req)).rejects.toThrow()
    expect((await payload.count({ collection: 'users', overrideAccess: true })).totalDocs).toBe(0)
    await expect(payload.create({
      collection: 'users', data, overrideAccess: true,
      context: { offlineAdminBootstrap: true },
    })).rejects.toThrow('offline bootstrap command')

    try {
      await bootstrapFirstAdmin(payload, data)
      const users = await payload.find({
        collection: 'users', where: { email: { equals: data.email } }, overrideAccess: true,
      })
      expect(users.docs[0].role).toBe('admin')
      await expect(bootstrapFirstAdmin(payload, data)).rejects.toThrow('only permitted')
    } finally {
      await payload.delete({
        collection: 'users', where: { email: { equals: data.email } }, overrideAccess: true,
      })
    }
  })

  it('claims a rate-limit window atomically under concurrent requests', async () => {
    const outcomes = await Promise.all(
      Array.from({ length: 20 }, () => consumeRateLimit(payload, rateKey, new Date(), 5)),
    )
    expect(outcomes.filter(Boolean)).toHaveLength(5)
  })

  it('rejects capture until the published privacy policy has owner approval', async () => {
    if (!privacyId) throw new Error('Privacy fixture was not initialized.')
    await payload.update({ collection: 'pages', id: privacyId, data: { ownerApproved: false }, overrideAccess: true })
    try {
      const { POST: signup } = await import('../../src/app/api/newsletter/route')
      const { POST: inquiry } = await import('../../src/app/api/inquiry/route')
      const response = await signup(jsonRequest('/api/newsletter', {
        email, marketingConsent: false, interest: 'kit', source: 'approval-test', website: '',
      }))
      expect(response.status).toBe(503)
      const contact = await inquiry(jsonRequest('/api/inquiry', {
        name: 'Test visitor', email, message: 'A consulting inquiry for approval testing.', website: '',
      }))
      expect(contact.status).toBe(503)
    } finally {
      await payload.update({ collection: 'pages', id: privacyId, data: { ownerApproved: true }, overrideAccess: true })
    }
  })

  it('persists kit-only signup before queueing and deduplicates repeat signup', async () => {
    const { POST } = await import('../../src/app/api/newsletter/route')
    const input = { email, marketingConsent: false, interest: 'kit', source: 'hero', website: '' }
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const response = await POST(jsonRequest('/api/newsletter', input))
      expect(response.status).toBe(200)
      expect(await response.json()).toHaveProperty('message')
    }
    const found = await payload.find({
      collection: 'subscribers',
      where: { email: { equals: email } },
      overrideAccess: true,
    })
    expect(found.totalDocs).toBe(1)
    const subscriber = found.docs[0]
    subscriberId = subscriber.id
    expect(subscriber).toMatchObject({
      state: 'pending',
      marketingConsent: false,
      consentState: 'not-consented',
      starterKitRequested: true,
    })
    const jobs = await payload.find({
      collection: 'payload-jobs',
      where: { taskSlug: { equals: 'send-confirmation' } },
      overrideAccess: true,
      limit: 100,
    })
    expect(jobs.docs.some((job) => (
      job.input &&
      typeof job.input === 'object' &&
      !Array.isArray(job.input) &&
      job.input.subscriberId === String(subscriberId)
    ))).toBe(true)
  })

  it('denies anonymous personal data and public user registration', async () => {
    await expect(
      payload.findGlobal({ slug: 'payload-jobs-stats', overrideAccess: false }),
    ).rejects.toThrow()
    for (const collection of [
      'subscribers', 'suppressions', 'inquiries', 'newsletter-campaigns',
      'newsletter-deliveries', 'starter-kit-assets', 'payload-jobs',
    ] as const) {
      await expect(payload.find({ collection, overrideAccess: false })).rejects.toThrow()
    }
    await expect(
      payload.create({
        collection: 'users',
        data: {
          email: `unauthorized-${runID}@example.test`,
          password: randomBytes(24).toString('hex'),
          role: 'editor',
        },
        overrideAccess: false,
      }),
    ).rejects.toThrow()
  })

  it('protects draft content with access controls rather than an unlisted slug', async () => {
    const page = await payload.create({
      collection: 'pages',
      data: {
        title: 'Private integration draft',
        slug: `draft-${runID}`,
        body: { root: { type: 'root', version: 1, children: [], direction: null, format: '', indent: 0 } },
      },
      draft: true,
      overrideAccess: true,
    })
    try {
      const publicResult = await payload.find({
        collection: 'pages',
        where: { slug: { equals: page.slug } },
        overrideAccess: false,
      })
      expect(publicResult.totalDocs).toBe(0)
      await expect(payload.findByID({
        collection: 'pages', id: page.id, overrideAccess: false,
      })).rejects.toThrow()
    } finally {
      await payload.delete({ collection: 'pages', id: page.id, overrideAccess: true })
    }
  })

  it('confirms without granting marketing consent and persists unsubscribe suppression', async () => {
    const { GET } = await import('../../src/app/api/confirm/route')
    const confirmToken = await signEmailToken(
      { purpose: 'confirm', subscriberId: String(subscriberId) },
      signingSecret,
      '1h',
    )
    const confirmed = await GET(new Request(`http://localhost:3000/api/confirm?token=${confirmToken}`))
    expect(confirmed.status).toBe(200)
    const subscriber = await payload.findByID({
      collection: 'subscribers', id: subscriberId, overrideAccess: true,
    })
    expect(subscriber).toMatchObject({ state: 'confirmed', consentState: 'not-consented', marketingConsent: false })
    const { POST } = await import('../../src/app/api/unsubscribe/route')
    const token = await signEmailToken(
      { purpose: 'unsubscribe', subscriberId: String(subscriberId) },
      signingSecret,
      '1h',
    )
    const response = await POST(jsonRequest('/api/unsubscribe', { token }))
    expect(response.status).toBe(200)
    const suppressed = await payload.find({
      collection: 'suppressions', where: { email: { equals: email } }, overrideAccess: true,
    })
    expect(suppressed.totalDocs).toBe(1)
  })

  it('persists the frontend inquiry shape and queues notification', async () => {
    const { POST } = await import('../../src/app/api/inquiry/route')
    const response = await POST(jsonRequest('/api/inquiry', {
      name: 'Integration test',
      email,
      message: 'This is an isolated local backend integration test.',
      website: '',
    }))
    expect(response.status).toBe(201)
    const found = await payload.find({
      collection: 'inquiries', where: { email: { equals: email } }, overrideAccess: true,
    })
    expect(found.totalDocs).toBe(1)
    inquiryId = found.docs[0].id
    expect(found.docs[0].notificationState).toBe('queued')
  })

  it('claims a durable maintenance job once across concurrent workers', async () => {
    const job = await payload.jobs.queue({
      task: 'prune-rate-limits',
      input: {},
      queue: runID,
    })
    try {
      await Promise.all([
        payload.jobs.run({ queue: runID, limit: 1 }),
        payload.jobs.run({ queue: runID, limit: 1 }),
      ])
      const completed = await payload.findByID({
        collection: 'payload-jobs', id: job.id, overrideAccess: true,
      })
      expect(completed.completedAt).toBeTruthy()
      expect(completed.totalTried).toBe(1)
      expect(completed.hasError).toBe(false)
    } finally {
      await payload.delete({ collection: 'payload-jobs', id: job.id, overrideAccess: true })
    }
  })
})
