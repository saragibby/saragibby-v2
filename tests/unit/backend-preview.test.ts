import { getPayload } from 'payload'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getPayloadConfigEnvironment, getServerEnvironment, getTokenEnvironment } from '../../src/lib/server/env'
import { assertBackendAvailable } from '../../src/lib/server/preview'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('preview backend isolation', () => {
  it('imports public API routes without credentials and returns preview errors at runtime', async () => {
    vi.stubEnv('DATABASE_URL', undefined)
    vi.stubEnv('PAYLOAD_SECRET', undefined)
    vi.stubEnv('SITE_PREVIEW', 'false')
    const unsubscribe = await import('../../src/app/api/unsubscribe/route')
    const signup = await import('../../src/app/api/newsletter/route')
    const campaign = await import('../../src/app/api/newsletter/campaigns/[campaignId]/route')
    expect(campaign.POST).toBeTypeOf('function')
    vi.stubEnv('SITE_PREVIEW', 'true')
    const logged = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const response = await unsubscribe.POST(new Request('http://localhost:3000/api/unsubscribe?token=preview-disabled', {
      method: 'POST',
    }))
    expect(response.status).toBe(503)
    expect(await response.json()).toHaveProperty('error')
    expect(logged).toHaveBeenCalled()
    const signupResponse = await signup.POST(new Request('http://localhost:3000/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'preview@example.test',
        marketingConsent: true,
        interest: 'newsletter',
        source: 'hero',
        website: '',
      }),
    }))
    expect(signupResponse.status).toBe(503)
    expect(signupResponse.headers.get('content-type')).toContain('application/json')
    expect(await signupResponse.json()).toHaveProperty('error')
  })

  it('only supplies disabled-backend placeholders for explicit preview config imports', () => {
    const config = getPayloadConfigEnvironment({ SITE_PREVIEW: 'true', NODE_ENV: 'production' })
    expect(config.DATABASE_URL).toBe('postgresql://localhost:1/preview_backend_disabled')
    expect(config.PAYLOAD_SECRET).toContain('preview-only-disabled-backend')
    expect(() => getPayloadConfigEnvironment({ NODE_ENV: 'production' })).toThrow('Server environment is invalid')
    expect(() => getPayloadConfigEnvironment({ VERCEL_ENV: 'preview', NODE_ENV: 'production' })).toThrow()
  })

  it('rejects runtime backend environment and email actions even with preview enabled', () => {
    const env: NodeJS.ProcessEnv = { SITE_PREVIEW: 'true', NODE_ENV: 'test' }
    expect(() => assertBackendAvailable(env)).toThrow('disabled in SITE_PREVIEW')
    expect(() => getServerEnvironment(env)).toThrow('disabled in SITE_PREVIEW')
    expect(() => getTokenEnvironment(env)).toThrow('disabled in SITE_PREVIEW')
  })

  it('imports Payload config but rejects initialization before database access', async () => {
    vi.stubEnv('SITE_PREVIEW', 'true')
    const { default: config } = await import('../../src/payload.config')
    const sanitized = await config
    expect(sanitized.secret).toContain('preview-only-disabled-backend')
    await expect(getPayload({ config, key: 'preview-isolation-test' })).rejects.toThrow(
      'disabled in SITE_PREVIEW',
    )
  }, 30_000)
})
