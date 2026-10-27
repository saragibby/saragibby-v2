import { describe, expect, it } from 'vitest'
import { getCanonicalSiteOrigin, getServerEnvironment, getTokenEnvironment } from '../../src/lib/server/env'
import { rateLimitKey } from '../../src/lib/server/rate-limit'
import {
  CONFIRMATION_RESEND_COOLDOWN_MS,
  canReceiveNewsletter,
  isConfirmationResendDue,
  shouldSendConfirmation,
  transitionToConfirmed,
} from '../../src/lib/server/state'
import { privateKitObjectPath, publicMediaURL } from '../../src/lib/server/storage'
import { signEmailToken, verifyEmailToken } from '../../src/lib/server/tokens'
import {
  inquirySchema,
  isHoneypotSubmission,
  readJsonBody,
  RequestValidationError,
  signupSchema,
} from '../../src/lib/server/validation'

const signingSecret = 'test-secret-with-more-than-thirty-two-characters'

describe('canonical site origin', () => {
  it('bounds the per-process Postgres pool size', () => {
    const env: NodeJS.ProcessEnv = {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://localhost/test',
      PAYLOAD_SECRET: signingSecret,
    }
    expect(getServerEnvironment(env).DATABASE_POOL_MAX).toBe(5)
    expect(getServerEnvironment({ ...env, DATABASE_POOL_MAX: '2' }).DATABASE_POOL_MAX).toBe(2)
    expect(() => getServerEnvironment({ ...env, DATABASE_POOL_MAX: '0' })).toThrow()
    expect(() => getServerEnvironment({ ...env, DATABASE_POOL_MAX: '101' })).toThrow()
  })
  it('uses the public origin fallback and requires matching configured origins', () => {
    expect(getCanonicalSiteOrigin({
      NODE_ENV: 'production', NEXT_PUBLIC_SITE_URL: 'https://example.test/',
    })).toBe('https://example.test')
    expect(() => getCanonicalSiteOrigin({
      NODE_ENV: 'production', SITE_URL: 'https://one.test', NEXT_PUBLIC_SITE_URL: 'https://two.test',
    })).toThrow('same origin')
  })

  it('rejects credentials, paths, queries, fragments and insecure production links', () => {
    for (const SITE_URL of [
      'https://user:password@example.test', 'https://example.test/path',
      'https://example.test?q=1', 'https://example.test/#fragment', 'http://example.test',
    ]) {
      expect(() => getTokenEnvironment({
        NODE_ENV: 'production', SITE_URL, EMAIL_SIGNING_SECRET: signingSecret,
      })).toThrow()
    }
  })
})

describe('signup and inquiry validation', () => {
  it('normalizes email and exposes the opt-in starter-kit contract', () => {
    expect(
      signupSchema.parse({
        email: '  Reader@Example.com ',
        marketingConsent: false,
        source: 'kit',
      }),
    ).toMatchObject({
      email: 'reader@example.com',
      marketingConsent: false,
      source: 'kit',
      starterKitRequested: true,
    })
  })

  it('accepts the signup interests and rejects invalid or extra fields', () => {
    expect(
      signupSchema.safeParse({
        email: 'reader@example.com',
        marketingConsent: true,
        interest: 'course',
        source: 'hero',
      }).success,
    ).toBe(true)
    expect(
      signupSchema.parse({
        email: 'reader@example.com',
        marketingConsent: false,
        interest: 'kit',
        source: 'hero',
      }),
    ).toMatchObject({ starterKitRequested: true })
    expect(
      signupSchema.safeParse({
        email: 'not-an-email',
        marketingConsent: true,
        source: 'hero',
      }).success,
    ).toBe(false)
    expect(
      signupSchema.safeParse({
        email: 'reader@example.com',
        marketingConsent: true,
        source: 'hero',
        role: 'admin',
      }).success,
    ).toBe(false)
  })

  it('normalizes inquiry email and enforces a useful message', () => {
    expect(
      inquirySchema.safeParse({
        name: 'Reader',
        email: 'reader@example.com',
        message: 'I would like to discuss a project with you.',
        website: '',
      }).success,
    ).toBe(true)
    const inquiry = inquirySchema.parse({
      name: 'Reader',
      email: ' READER@EXAMPLE.COM ',
      projectType: 'AI systems',
      message: 'I would like to discuss a project with you.',
    })
    expect(inquiry.email).toBe('reader@example.com')
    expect(
      inquirySchema.safeParse({
        ...inquiry,
        message: 'short',
      }).success,
    ).toBe(false)
  })

  it('limits JSON request bodies and detects a filled honeypot', async () => {
    await expect(
      readJsonBody(
        new Request('https://example.test', {
          method: 'POST',
          body: JSON.stringify({ value: 'x'.repeat(9000) }),
        }),
      ),
    ).rejects.toBeInstanceOf(RequestValidationError)
    expect(isHoneypotSubmission('website populated')).toBe(true)
    expect(isHoneypotSubmission('')).toBe(false)
  })
})

describe('subscriber state', () => {
  it('only sends newsletter to confirmed, consented, unsuppressed subscribers', () => {
    expect(
      canReceiveNewsletter({
        state: 'confirmed',
        consentState: 'consented',
        suppressed: false,
      }),
    ).toBe(true)
    expect(
      canReceiveNewsletter({
        state: 'pending',
        consentState: 'consented',
        suppressed: false,
      }),
    ).toBe(false)
    expect(
      canReceiveNewsletter({
        state: 'confirmed',
        consentState: 'consented',
        suppressed: true,
      }),
    ).toBe(false)
  })

  it('requires confirmation for opt-in or kit requests and keeps consent separate', () => {
    expect(
      shouldSendConfirmation({
        state: 'pending',
        consentState: 'not-consented',
        starterKitRequested: true,
        suppressed: false,
      }),
    ).toBe(true)
    expect(
      shouldSendConfirmation({
        state: 'pending',
        consentState: 'not-consented',
        starterKitRequested: false,
        suppressed: false,
      }),
    ).toBe(false)
    expect(
      transitionToConfirmed({
        state: 'pending',
        consentState: 'pending',
        marketingConsent: false,
      }),
    ).toEqual({ state: 'confirmed', consentState: 'not-consented' })
  })

  it('rate-limits confirmation resends', () => {
    const now = Date.parse('2026-10-27T12:00:00.000Z')
    const sentAt = new Date(now - CONFIRMATION_RESEND_COOLDOWN_MS + 1).toISOString()
    expect(isConfirmationResendDue(null, now)).toBe(true)
    expect(isConfirmationResendDue(sentAt, now)).toBe(false)
    expect(
      isConfirmationResendDue(
        new Date(now - CONFIRMATION_RESEND_COOLDOWN_MS).toISOString(),
        now,
      ),
    ).toBe(true)
  })
})

describe('signed email actions and storage paths', () => {
  it('signs purpose-bound expiring tokens', async () => {
    const now = new Date('2026-10-27T12:00:00.000Z')
    const token = await signEmailToken(
      { purpose: 'confirm', subscriberId: 'subscriber-1' },
      signingSecret,
      '1h',
      now,
    )
    await expect(
      verifyEmailToken(token, 'confirm', signingSecret, now),
    ).resolves.toEqual({
      purpose: 'confirm',
      subscriberId: 'subscriber-1',
    })
    await expect(
      verifyEmailToken(token, 'unsubscribe', signingSecret, now),
    ).rejects.toThrow()
    await expect(
      verifyEmailToken(
        token,
        'confirm',
        signingSecret,
        new Date('2026-10-27T14:00:00.000Z'),
      ),
    ).rejects.toThrow()
  })

  it('requires valid link secrets and restricts private object paths', () => {
    expect(() =>
      getTokenEnvironment({ NODE_ENV: 'test', EMAIL_SIGNING_SECRET: 'too-short' }),
    ).toThrow('not configured')
    expect(
      privateKitObjectPath('scorecard.pdf', 'starter-kit-assets'),
    ).toBe('starter-kit-assets/scorecard.pdf')
    expect(() => privateKitObjectPath('../public/file.pdf')).toThrow()
    expect(() =>
      privateKitObjectPath('file.pdf', 'public-media'),
    ).toThrow('outside its private storage folder')
  })

  it('generates URLs from the public bucket only', () => {
    expect(
      publicMediaURL(
        'https://storage.example.test',
        'public-media',
        'portrait one.webp',
        'media',
      ),
    ).toBe(
      'https://storage.example.test/storage/v1/object/public/public-media/media/portrait%20one.webp',
    )
    expect(rateLimitKey('signup-email', 'reader@example.com', signingSecret)).not.toContain(
      'reader@example.com',
    )
  })
})
