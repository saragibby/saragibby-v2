import { getTokenEnvironment } from '@/lib/server/env'
import { getServerPayload } from '@/lib/server/payload'
import { verifyEmailToken } from '@/lib/server/tokens'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token')
  if (!token || token.length > 4096) {
    return NextResponse.json({ error: 'A valid confirmation token is required.' }, { status: 400 })
  }

  let env: ReturnType<typeof getTokenEnvironment>
  try {
    env = getTokenEnvironment()
  } catch (error) {
    console.error('Email confirmation configuration is unavailable.', error)
    return NextResponse.json(
      { error: 'Email confirmation is temporarily unavailable.' },
      { status: 503 },
    )
  }
  let claims: Awaited<ReturnType<typeof verifyEmailToken>>
  try {
    claims = await verifyEmailToken(token, 'confirm', env.EMAIL_SIGNING_SECRET)
  } catch {
    return NextResponse.json(
      { error: 'This confirmation link is invalid or expired.' },
      { status: 400 },
    )
  }

  try {
    const payload = await getServerPayload()
    const subscriber = await payload.findByID({
      collection: 'subscribers',
      id: claims.subscriberId,
      overrideAccess: true,
    })

    if (!subscriber.confirmedAt) {
      await payload.update({
        collection: 'subscribers',
        id: subscriber.id,
        data: {
          state: 'confirmed',
          consentState: subscriber.marketingConsent ? 'consented' : 'not-consented',
          confirmedAt: new Date().toISOString(),
          ...(subscriber.starterKitRequested
            ? { starterKitDeliveryState: 'queued' }
            : {}),
        },
        overrideAccess: true,
      })

    }

    const currentSubscriber = await payload.findByID({
      collection: 'subscribers',
      id: subscriber.id,
      overrideAccess: true,
    })
    if (
      currentSubscriber.starterKitRequested &&
      currentSubscriber.starterKitDeliveryState !== 'delivered'
    ) {
      try {
        await payload.update({
          collection: 'subscribers',
          id: subscriber.id,
          data: { starterKitDeliveryState: 'queued' },
          overrideAccess: true,
        })
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
            lastEmailError: 'Starter Kit delivery could not be queued.',
          },
          overrideAccess: true,
        })
        console.error('Confirmed Starter Kit delivery could not be queued.', error)
        return NextResponse.json(
          { error: 'Your email is confirmed, but delivery is temporarily unavailable.' },
          { status: 503 },
        )
      }
    }

    return NextResponse.json({
      message: 'Your email address has been confirmed.',
    })
  } catch (error) {
    console.error('Email confirmation failed.', error)
    return NextResponse.json(
      { error: 'Email confirmation could not be completed. Please try again later.' },
      { status: 503 },
    )
  }
}
