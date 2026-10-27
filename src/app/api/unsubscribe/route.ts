import { getTokenEnvironment, getServerEnvironment } from '@/lib/server/env'
import { isUniqueConstraintError } from '@/lib/server/errors'
import { clientAddress, consumeRateLimit, rateLimitKey } from '@/lib/server/rate-limit'
import { getServerPayload } from '@/lib/server/payload'
import { readJsonBody, RequestValidationError } from '@/lib/server/validation'
import { verifyEmailToken } from '@/lib/server/tokens'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token')
  if (!token || token.length > 4096) {
    return NextResponse.json({ error: 'A valid unsubscribe token is required.' }, { status: 400 })
  }
  let env: ReturnType<typeof getTokenEnvironment>
  try {
    env = getTokenEnvironment()
  } catch (error) {
    console.error('Unsubscribe configuration is unavailable.', error)
    return NextResponse.json({ error: 'Unsubscribe is temporarily unavailable.' }, { status: 503 })
  }
  try {
    await verifyEmailToken(token, 'unsubscribe', env.EMAIL_SIGNING_SECRET)
  } catch {
    return NextResponse.json({ error: 'This unsubscribe link is invalid or expired.' }, { status: 400 })
  }
  try {
    const safeToken = token.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
    return new Response(
      `<!doctype html><html lang="en"><meta charset="utf-8"><title>Unsubscribe</title><body><main><h1>Unsubscribe</h1><p>Choose below to stop receiving marketing email.</p><form method="post" action="/api/unsubscribe?token=${safeToken}"><button type="submit">Unsubscribe</button></form></main></body></html>`,
      { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } },
    )
  } catch {
    return NextResponse.json({ error: 'Unsubscribe is temporarily unavailable.' }, { status: 503 })
  }
}

export async function POST(request: Request) {
  let token = new URL(request.url).searchParams.get('token')
  try {
    const contentType = request.headers.get('content-type') ?? ''
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const body = await request.text()
      if (new TextEncoder().encode(body).byteLength > 8192) {
        return NextResponse.json({ error: 'Request body is too large.' }, { status: 413 })
      }
      const form = new URLSearchParams(body)
      token ??= form.get('token')
    } else if (contentType.includes('application/json')) {
      const body = (await readJsonBody(request)) as { token?: unknown }
      if (typeof body.token === 'string') token ??= body.token
    } else if (request.headers.has('content-length')) {
      return NextResponse.json({ error: 'Unsupported request content type.' }, { status: 415 })
    }

    if (!token || token.length > 4096) {
      return NextResponse.json({ error: 'A valid unsubscribe token is required.' }, { status: 400 })
    }
    const env = getTokenEnvironment()
    let claims: Awaited<ReturnType<typeof verifyEmailToken>>
    try {
      claims = await verifyEmailToken(token, 'unsubscribe', env.EMAIL_SIGNING_SECRET)
    } catch {
      return NextResponse.json(
        { error: 'This unsubscribe link is invalid or expired.' },
        { status: 400 },
      )
    }
    const payload = await getServerPayload()
    const ipKey = rateLimitKey(
      'unsubscribe-ip',
      clientAddress(request),
      getServerEnvironment().PAYLOAD_SECRET,
    )
    if (!(await consumeRateLimit(payload, ipKey, new Date(), 20))) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
    }
    const subscriber = await payload.findByID({
      collection: 'subscribers',
      id: claims.subscriberId,
      overrideAccess: true,
    })
    const email = String(subscriber.email).toLowerCase()

    try {
      await payload.create({
        collection: 'suppressions',
        data: {
          email,
          reason: 'unsubscribe',
          occurredAt: new Date().toISOString(),
          source: 'email-link',
        },
        overrideAccess: true,
      })
    } catch (error) {
      if (!isUniqueConstraintError(error)) throw error
    }
    if (subscriber.state !== 'unsubscribed') {
      await payload.update({
        collection: 'subscribers',
        id: subscriber.id,
        data: {
          state: 'unsubscribed',
          consentState: 'withdrawn',
          marketingConsent: false,
          unsubscribedAt: new Date().toISOString(),
        },
        overrideAccess: true,
      })
    }
    return NextResponse.json({ message: 'You have been unsubscribed.' })
  } catch (error) {
    if (error instanceof RequestValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    console.error('Unsubscribe request failed.', error)
    return NextResponse.json(
      { error: 'Unsubscribe could not be completed. Please try again later.' },
      { status: 503 },
    )
  }
}
