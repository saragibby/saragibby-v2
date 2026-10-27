import { z } from 'zod'

const interestSchema = z.enum([
  'newsletter',
  'course',
  'community',
  'shop',
  'kit',
])

const sourceSchema = z
  .string()
  .trim()
  .min(1)
  .max(50)
  .regex(/^[a-zA-Z0-9_-]+$/)

export const signupSchema = z
  .object({
    email: z.string().trim().email().max(254),
    marketingConsent: z.boolean(),
    interest: interestSchema.optional(),
    source: sourceSchema,
    website: z.string().max(200).optional(),
  })
  .strict()
  .transform((value) => ({
    ...value,
    email: value.email.toLowerCase(),
    starterKitRequested: value.source === 'kit' || value.interest === 'kit',
  }))

export const inquirySchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
    company: z.string().trim().max(160).optional(),
    projectType: z.string().trim().min(1).max(100).optional(),
    message: z.string().trim().min(20).max(5000),
    website: z.string().max(200).optional(),
  })
  .strict()

export type SignupInput = z.infer<typeof signupSchema>
export type InquiryInput = z.infer<typeof inquirySchema>
export type SignupInterest = z.infer<typeof interestSchema>

export const MAX_REQUEST_BYTES = 8_192

export async function readJsonBody(request: Request): Promise<unknown> {
  const declaredLength = Number(request.headers.get('content-length') ?? 0)
  if (declaredLength > MAX_REQUEST_BYTES) {
    throw new RequestValidationError('Request body is too large.')
  }

  const text = await request.text()
  if (new TextEncoder().encode(text).byteLength > MAX_REQUEST_BYTES) {
    throw new RequestValidationError('Request body is too large.')
  }
  try {
    return JSON.parse(text) as unknown
  } catch {
    throw new RequestValidationError('Request body must be valid JSON.')
  }
}

export class RequestValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RequestValidationError'
  }
}

export function validationErrorMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? 'The request is invalid.'
}

export function isHoneypotSubmission(value: string | undefined): boolean {
  return Boolean(value?.trim())
}
