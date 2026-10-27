import { getServerPayload } from '@/lib/server/payload'
import { isConfirmationResendDue } from '@/lib/server/state'
import { clientAddress, consumeRateLimit, rateLimitKey } from '@/lib/server/rate-limit'
import { isUniqueConstraintError } from '@/lib/server/errors'
import {
  isHoneypotSubmission,
  readJsonBody,
  RequestValidationError,
  type SignupInterest,
  type SignupInput,
  signupSchema,
  validationErrorMessage,
} from '@/lib/server/validation'
import { getServerEnvironment } from '@/lib/server/env'
import { NextResponse } from 'next/server'
import type { Payload } from 'payload'
import { ZodError } from 'zod'
import type { Subscriber } from '@/payload-types'
import { isEmailDeliveryEnabled } from '@/lib/email-availability'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CONSENT_WORDING_VERSION = '2026-10-27'
const GENERIC_MESSAGE =
  'Thanks. If a confirmation is needed, check your inbox for the next step.'

function selectedInterests(input: SignupInput): SignupInterest[] {
  const interests: SignupInterest[] = []
  if (input.interest) interests.push(input.interest)
  if (input.starterKitRequested) interests.push('kit')
  if (input.marketingConsent && !input.interest) interests.push('newsletter')
  return [...new Set(interests)]
}

function isSubscriberSuppressed(
  payload: Awaited<ReturnType<typeof getServerPayload>>,
  email: string,
) {
  return payload.find({
    collection: 'suppressions',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })
}

async function updateExistingSubscriber(
  payload: Payload,
  subscriber: Subscriber,
  input: SignupInput,
): Promise<{
  subscriber: Subscriber
  shouldQueueConfirmation: boolean
  shouldQueueKit: boolean
  unsubscribed: boolean
}> {
  if (subscriber.state === 'unsubscribed') {
    return {
      subscriber,
      shouldQueueConfirmation: false,
      shouldQueueKit: false,
      unsubscribed: true,
    }
  }

  const currentInterests = subscriber.interests ?? []
  const interests = [...new Set([...currentInterests, ...selectedInterests(input)])]
  const confirmationResendDue =
    subscriber.state === 'pending' &&
    isConfirmationResendDue(subscriber.confirmationSentAt)
  const data: Partial<Subscriber> = {}

  if (input.marketingConsent && !subscriber.marketingConsent) {
    data.marketingConsent = true
    data.consentState = 'pending'
    data.consentWordingVersion = CONSENT_WORDING_VERSION
    data.consentTimestamp = new Date().toISOString()
    if (subscriber.state === 'confirmed') {
      data.state = 'pending'
      data.confirmedAt = null
      data.confirmationSentAt = null
    }
  }
  if (interests.length !== currentInterests.length) data.interests = interests
  if (confirmationResendDue && subscriber.confirmationSentAt) {
    data.confirmationSentAt = null
  }
  if (input.starterKitRequested && !subscriber.starterKitRequested) {
    data.starterKitRequested = true
    data.starterKitDeliveryState =
      subscriber.state === 'confirmed' ? 'queued' : 'pending'
  }

  const updated =
    Object.keys(data).length > 0
      ? await payload.update({
          collection: 'subscribers',
          id: subscriber.id,
          data,
          overrideAccess: true,
        })
      : subscriber

  return {
    subscriber: updated,
    shouldQueueConfirmation:
      updated.state === 'pending' &&
      isConfirmationResendDue(updated.confirmationSentAt),
    shouldQueueKit:
      input.starterKitRequested &&
      updated.state === 'confirmed' &&
      updated.starterKitDeliveryState !== 'delivered',
    unsubscribed: false,
  }
}

export async function POST(request: Request) {
  if (!isEmailDeliveryEnabled()) {
    return NextResponse.json(
      { error: 'Signup is not open yet. Email delivery is being connected.' },
      { status: 503 },
    )
  }
  let body: unknown
  try {
    body = await readJsonBody(request)
  } catch (error) {
    const message =
      error instanceof RequestValidationError
        ? error.message
        : 'Request body is invalid.'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const parsed = signupSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: validationErrorMessage(parsed.error) },
      { status: 400 },
    )
  }
  const input = parsed.data
  if (isHoneypotSubmission(input.website)) {
    return NextResponse.json({ error: 'The request could not be accepted.' }, { status: 400 })
  }

  try {
    const env = getServerEnvironment()
    const payload = await getServerPayload()
    if (!(await hasApprovedPrivacyPolicy(payload))) {
      return NextResponse.json({ error: 'Signup is unavailable until the privacy policy is approved.' }, { status: 503 })
    }
    const remoteKey = rateLimitKey('signup-ip', clientAddress(request), env.PAYLOAD_SECRET)
    const emailKey = rateLimitKey('signup-email', input.email, env.PAYLOAD_SECRET)
    const [remoteAllowed, emailAllowed] = await Promise.all([
      consumeRateLimit(payload, remoteKey),
      consumeRateLimit(payload, emailKey),
    ])
    if (!remoteAllowed || !emailAllowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 },
      )
    }

    if (!input.marketingConsent && !input.starterKitRequested) {
      return NextResponse.json({ message: GENERIC_MESSAGE })
    }

    const suppressions = await isSubscriberSuppressed(payload, input.email)
    if (suppressions.docs.length > 0) {
      return NextResponse.json({ message: GENERIC_MESSAGE })
    }

    const existing = await payload.find({
      collection: 'subscribers',
      where: { email: { equals: input.email } },
      limit: 1,
      overrideAccess: true,
    })
    let subscriber: Subscriber
    let shouldQueueConfirmation = false
    let shouldQueueKit = false

    const existingSubscriber = existing.docs[0]
    if (existingSubscriber) {
      const update = await updateExistingSubscriber(
        payload,
        existingSubscriber,
        input,
      )
      if (update.unsubscribed) {
        return NextResponse.json({ message: GENERIC_MESSAGE })
      }
      subscriber = update.subscriber
      shouldQueueKit = update.shouldQueueKit
      shouldQueueConfirmation = update.shouldQueueConfirmation
    } else {
      const interests = selectedInterests(input)
      try {
        subscriber = await payload.create({
          collection: 'subscribers',
          data: {
            email: input.email,
            state: 'pending',
            consentState: input.marketingConsent ? 'pending' : 'not-consented',
            marketingConsent: input.marketingConsent,
            ...(input.marketingConsent
              ? {
                  consentWordingVersion: CONSENT_WORDING_VERSION,
                  consentTimestamp: new Date().toISOString(),
                }
              : {}),
            source: input.source,
            interests,
            starterKitRequested: input.starterKitRequested,
            starterKitDeliveryState: input.starterKitRequested
              ? 'pending'
              : 'not-requested',
          },
          overrideAccess: true,
        })
        shouldQueueConfirmation = true
      } catch (error) {
        if (!isUniqueConstraintError(error)) throw error
        const winner = await payload.find({
          collection: 'subscribers',
          where: { email: { equals: input.email } },
          limit: 1,
          overrideAccess: true,
        })
        const concurrentSubscriber = winner.docs[0]
        if (!concurrentSubscriber) throw error
        const update = await updateExistingSubscriber(
          payload,
          concurrentSubscriber,
          input,
        )
        if (update.unsubscribed) {
          return NextResponse.json({ message: GENERIC_MESSAGE })
        }
        subscriber = update.subscriber
        shouldQueueConfirmation = update.shouldQueueConfirmation
        shouldQueueKit = update.shouldQueueKit
      }
    }

    if (shouldQueueConfirmation) {
      try {
        await payload.jobs.queue({
          task: 'send-confirmation',
          input: { subscriberId: String(subscriber.id) },
        })
      } catch (error) {
        await payload.update({
          collection: 'subscribers',
          id: subscriber.id,
          data: { lastEmailError: 'Confirmation job could not be queued.' },
          overrideAccess: true,
        })
        console.error('Signup confirmation could not be queued.', error)
        return NextResponse.json(
          { error: 'Your signup was saved, but email processing is temporarily unavailable.' },
          { status: 503 },
        )
      }
    }

    if (shouldQueueKit) {
      try {
        await payload.jobs.queue({
          task: 'send-starter-kit',
          input: { subscriberId: String(subscriber.id) },
        })
      } catch (error) {
        await payload.update({
          collection: 'subscribers',
          id: subscriber.id,
          data: {
            starterKitDeliveryState: 'failed',
            lastEmailError: 'Starter Kit job could not be queued.',
          },
          overrideAccess: true,
        })
        console.error('Starter Kit delivery could not be queued.', error)
        return NextResponse.json(
          { error: 'Your request was saved, but delivery is temporarily unavailable.' },
          { status: 503 },
        )
      }
    }

    return NextResponse.json({ message: GENERIC_MESSAGE })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: validationErrorMessage(error) },
        { status: 400 },
      )
    }
    console.error('Newsletter signup processing failed.', error)
    return NextResponse.json(
      { error: 'Signup could not be processed. Please try again later.' },
      { status: 503 },
    )
  }
}
import { hasApprovedPrivacyPolicy } from '@/lib/server/privacy-approval'
