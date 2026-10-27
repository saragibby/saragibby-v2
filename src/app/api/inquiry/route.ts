import { isHoneypotSubmission, inquirySchema, readJsonBody, RequestValidationError, validationErrorMessage } from '@/lib/server/validation'
import { getServerEnvironment } from '@/lib/server/env'
import { getServerPayload } from '@/lib/server/payload'
import { clientAddress, consumeRateLimit, rateLimitKey } from '@/lib/server/rate-limit'
import { NextResponse } from 'next/server'
import { hasApprovedPrivacyPolicy } from '@/lib/server/privacy-approval'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await readJsonBody(request)
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof RequestValidationError
            ? error.message
            : 'Request body is invalid.',
      },
      { status: 400 },
    )
  }
  const parsed = inquirySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: validationErrorMessage(parsed.error) },
      { status: 400 },
    )
  }
  if (isHoneypotSubmission(parsed.data.website)) {
    return NextResponse.json({ error: 'The request could not be accepted.' }, { status: 400 })
  }

  try {
    const env = getServerEnvironment()
    const payload = await getServerPayload()
    if (!(await hasApprovedPrivacyPolicy(payload))) {
      return NextResponse.json({ error: 'Inquiries are unavailable until the privacy policy is approved.' }, { status: 503 })
    }
    const key = rateLimitKey('inquiry-ip', clientAddress(request), env.PAYLOAD_SECRET)
    if (!(await consumeRateLimit(payload, key, new Date(), 3))) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 },
      )
    }

    const inquiryData = { ...parsed.data }
    delete inquiryData.website
    const inquiry = await payload.create({
      collection: 'inquiries',
      data: {
        ...inquiryData,
        status: 'new',
        notificationState: 'pending',
      },
      overrideAccess: true,
    })
    try {
      await payload.update({
        collection: 'inquiries',
        id: inquiry.id,
        data: { notificationState: 'queued' },
        overrideAccess: true,
      })
      await payload.jobs.queue({
        task: 'notify-inquiry',
        input: { inquiryId: String(inquiry.id) },
      })
    } catch (error) {
      await payload.update({
        collection: 'inquiries',
        id: inquiry.id,
        data: {
          notificationState: 'failed',
          notificationError: 'Notification could not be queued.',
        },
        overrideAccess: true,
      })
      console.error('Inquiry notification could not be queued.', error)
      return NextResponse.json(
        { error: 'Your inquiry was saved, but notification processing is unavailable.' },
        { status: 503 },
      )
    }
    return NextResponse.json({ message: 'Your inquiry has been received.' }, { status: 201 })
  } catch (error) {
    console.error('Consulting inquiry submission failed.', error)
    return NextResponse.json(
      { error: 'Your inquiry could not be saved. Please try again later.' },
      { status: 503 },
    )
  }
}
