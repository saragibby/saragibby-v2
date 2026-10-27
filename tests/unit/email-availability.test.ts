import { afterEach, describe, expect, it, vi } from 'vitest'
import { isEmailDeliveryEnabled } from '../../src/lib/email-availability'
import { getEmailEnvironment, getServerEnvironment } from '../../src/lib/server/env'
import { POST as signup } from '../../src/app/api/newsletter/route'
import { POST as inquiry } from '../../src/app/api/inquiry/route'

afterEach(() => vi.unstubAllEnvs())

describe('content-only launch', () => {
  it('rejects a pool too small for Payload to initialize', () => {
    expect(() => getServerEnvironment({
      NODE_ENV: 'test',
      SITE_PREVIEW: 'false',
      DATABASE_URL: 'postgresql://localhost/example',
      PAYLOAD_SECRET: 'test-secret-with-at-least-thirty-two-characters',
      DATABASE_POOL_MAX: '1',
    })).toThrow('DATABASE_POOL_MAX')
  })
  it('preserves existing behavior unless explicitly disabled', () => {
    expect(isEmailDeliveryEnabled({ NODE_ENV: 'test' })).toBe(true)
    expect(isEmailDeliveryEnabled({ NODE_ENV: 'test', EMAIL_DELIVERY_ENABLED: 'true' })).toBe(true)
    expect(isEmailDeliveryEnabled({ NODE_ENV: 'test', EMAIL_DELIVERY_ENABLED: 'false' })).toBe(false)
  })

  it('blocks email transport even with complete SMTP settings', () => {
    expect(() => getEmailEnvironment({
      NODE_ENV: 'test',
      EMAIL_DELIVERY_ENABLED: 'false',
      SMTP_HOST: 'smtp.example.com',
      SMTP_PORT: '587',
      EMAIL_FROM: 'hello@example.com',
    })).toThrow('Email delivery is disabled')
  })

  it('rejects capture before database access or request processing', async () => {
    vi.stubEnv('EMAIL_DELIVERY_ENABLED', 'false')
    vi.stubEnv('DATABASE_URL', undefined)
    vi.stubEnv('PAYLOAD_SECRET', undefined)
    for (const handler of [signup, inquiry]) {
      const response = await handler(new Request('https://example.com/api', {
        method: 'POST',
        body: '{}',
      }))
      expect(response.status).toBe(503)
      expect(await response.json()).toHaveProperty('error', expect.stringContaining('Email delivery'))
    }
  })
})
