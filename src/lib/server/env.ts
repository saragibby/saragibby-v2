import './load-env'
import { z } from 'zod'
import { assertBackendAvailable } from './preview'
import { isEmailDeliveryEnabled } from '../email-availability'

const optionalNonEmpty = z.string().trim().min(1).optional()

const serverEnvironmentSchema = z.object({
  DATABASE_URL: z.string().trim().min(1),
  DATABASE_CA_CERT: optionalNonEmpty,
  DATABASE_POOL_MAX: z.coerce.number().int().min(2).max(100).default(5),
  PAYLOAD_SECRET: z.string().min(32),
  SITE_URL: z.string().url().optional(),
  EMAIL_SIGNING_SECRET: z.string().min(32).optional(),
  SMTP_HOST: optionalNonEmpty,
  SMTP_PORT: z.coerce.number().int().positive().max(65535).optional(),
  SMTP_SECURE: z.enum(['true', 'false']).default('false'),
  SMTP_USER: optionalNonEmpty,
  SMTP_PASSWORD: optionalNonEmpty,
  EMAIL_FROM: z.string().email().optional(),
  CONTACT_EMAIL: z.string().email().optional(),
  SUPABASE_STORAGE_URL: z.string().url().optional(),
  SUPABASE_STORAGE_SERVICE_KEY: optionalNonEmpty,
  SUPABASE_S3_ACCESS_KEY_ID: optionalNonEmpty,
  SUPABASE_S3_SECRET_ACCESS_KEY: optionalNonEmpty,
  SUPABASE_S3_REGION: z.string().trim().min(1).default('us-east-1'),
  SUPABASE_S3_ENDPOINT: z.string().url().optional(),
  SUPABASE_PUBLIC_MEDIA_BUCKET: optionalNonEmpty,
  SUPABASE_PRIVATE_KIT_BUCKET: optionalNonEmpty,
})

export type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>

export function getCanonicalSiteOrigin(env: NodeJS.ProcessEnv = process.env): string {
  const validate = (value: string): string => {
    const url = new URL(value)
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      url.username || url.password || url.pathname !== '/' || url.search || url.hash
    ) {
      throw new Error('Site URL must be an origin without credentials, path, query, or fragment.')
    }
    if (env.NODE_ENV === 'production' && url.protocol !== 'https:') {
      throw new Error('The production site must use an HTTPS origin.')
    }
    return url.origin
  }
  const privateOrigin = env.SITE_URL ? validate(env.SITE_URL) : undefined
  const publicOrigin = env.NEXT_PUBLIC_SITE_URL ? validate(env.NEXT_PUBLIC_SITE_URL) : undefined
  if (privateOrigin && publicOrigin && privateOrigin !== publicOrigin) {
    throw new Error('SITE_URL and NEXT_PUBLIC_SITE_URL must use the same origin.')
  }
  const origin = privateOrigin ?? publicOrigin
  if (origin) return origin
  if (env.NODE_ENV === 'development' || env.NODE_ENV === 'test') return 'http://localhost:3000'
  throw new Error('SITE_URL or NEXT_PUBLIC_SITE_URL must be configured outside local development.')
}

export function getPayloadConfigEnvironment(
  env: NodeJS.ProcessEnv = process.env,
): ServerEnvironment {
  if (env.SITE_PREVIEW === 'true') {
    return {
      DATABASE_URL: 'postgresql://localhost:1/preview_backend_disabled',
      DATABASE_POOL_MAX: 5,
      PAYLOAD_SECRET: 'preview-only-disabled-backend-not-a-production-secret',
      SITE_URL: 'http://localhost:3000',
      SMTP_SECURE: 'false',
      SUPABASE_S3_REGION: 'us-east-1',
    }
  }
  return getServerEnvironment(env)
}

export function getTokenEnvironment(
  env: NodeJS.ProcessEnv = process.env,
): { SITE_URL: string; EMAIL_SIGNING_SECRET: string } {
  assertBackendAvailable(env)
  const parsed = z
    .object({
      SITE_URL: z.string().url().optional(),
      EMAIL_SIGNING_SECRET: z.string().min(32),
    })
    .safeParse(env)
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ')
    throw new Error(`Email action links are not configured: ${details}`)
  }
  const siteURL = getCanonicalSiteOrigin(env)
  return { ...parsed.data, SITE_URL: siteURL }
}

export function getServerEnvironment(
  env: NodeJS.ProcessEnv = process.env,
): ServerEnvironment {
  assertBackendAvailable(env)
  const parsed = serverEnvironmentSchema.safeParse(env)
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ')
    throw new Error(`Server environment is invalid: ${details}`)
  }
  const siteURL = getCanonicalSiteOrigin(env)
  return { ...parsed.data, SITE_URL: siteURL }
}

const smtpEnvironmentSchema = z
  .object({
    SMTP_HOST: z.string().trim().min(1),
    SMTP_PORT: z.coerce.number().int().positive().max(65535),
    SMTP_SECURE: z.enum(['true', 'false']).default('false'),
    SMTP_USER: optionalNonEmpty,
    SMTP_PASSWORD: optionalNonEmpty,
    EMAIL_FROM: z.string().email(),
  })
  .superRefine((value, context) => {
    if (Boolean(value.SMTP_USER) !== Boolean(value.SMTP_PASSWORD)) {
      context.addIssue({
        code: 'custom',
        message: 'SMTP_USER and SMTP_PASSWORD must either both be set or both be omitted.',
      })
    }
  })

export function getEmailEnvironment(
  env: NodeJS.ProcessEnv = process.env,
): z.infer<typeof smtpEnvironmentSchema> {
  if (!isEmailDeliveryEnabled(env)) {
    throw new Error('Email delivery is disabled until the sending service is connected.')
  }
  const parsed = smtpEnvironmentSchema.safeParse(env)
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ')
    throw new Error(`Email delivery is not configured: ${details}`)
  }
  return parsed.data
}

export function getContactEmail(
  env: NodeJS.ProcessEnv = process.env,
): string {
  const parsed = z.object({ CONTACT_EMAIL: z.string().email() }).safeParse(env)
  if (!parsed.success) {
    throw new Error('CONTACT_EMAIL must be configured for inquiry notifications.')
  }
  return parsed.data.CONTACT_EMAIL
}
