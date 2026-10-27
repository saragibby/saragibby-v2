import { getTokenEnvironment, getServerEnvironment } from '@/lib/server/env'
import { getServerPayload } from '@/lib/server/payload'
import { privateKitObjectPath } from '@/lib/server/storage'
import { verifyEmailToken } from '@/lib/server/tokens'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token')
  if (!token || token.length > 4096) {
    return NextResponse.json({ error: 'A valid download token is required.' }, { status: 400 })
  }

  let emailEnv: ReturnType<typeof getTokenEnvironment>
  let env: ReturnType<typeof getServerEnvironment>
  try {
    emailEnv = getTokenEnvironment()
    env = getServerEnvironment()
  } catch (error) {
    console.error('Starter Kit download configuration is unavailable.', error)
    return NextResponse.json(
      { error: 'Starter Kit downloads are temporarily unavailable.' },
      { status: 503 },
    )
  }
  let claims: Awaited<ReturnType<typeof verifyEmailToken>>
  try {
    claims = await verifyEmailToken(token, 'download', emailEnv.EMAIL_SIGNING_SECRET)
  } catch {
    return NextResponse.json(
      { error: 'This download link is invalid or expired.' },
      { status: 400 },
    )
  }
  try {
    if (!claims.assetId) throw new Error('Download token has no asset claim.')
    if (
      !env.SUPABASE_STORAGE_URL ||
      !env.SUPABASE_STORAGE_SERVICE_KEY ||
      !env.SUPABASE_PRIVATE_KIT_BUCKET ||
      !env.SUPABASE_S3_ENDPOINT ||
      !env.SUPABASE_S3_ACCESS_KEY_ID ||
      !env.SUPABASE_S3_SECRET_ACCESS_KEY
    ) {
      throw new Error('Private Starter Kit storage is not configured.')
    }

    const payload = await getServerPayload()
    const [subscriber, asset] = await Promise.all([
      payload.findByID({
        collection: 'subscribers',
        id: claims.subscriberId,
        overrideAccess: true,
      }),
      payload.findByID({
        collection: 'starter-kit-assets',
        id: claims.assetId,
        overrideAccess: true,
      }),
    ])
    if (!subscriber.confirmedAt || !subscriber.starterKitRequested) {
      return NextResponse.json({ error: 'This download is not available.' }, { status: 403 })
    }
    if (!asset.filename) throw new Error('The requested Starter Kit asset has no filename.')

    const objectPath = privateKitObjectPath(asset.filename)
    const storageURL = new URL(
      `/storage/v1/object/sign/${encodeURIComponent(env.SUPABASE_PRIVATE_KIT_BUCKET)}/${objectPath}`,
      env.SUPABASE_STORAGE_URL,
    )
    const response = await fetch(storageURL, {
      method: 'POST',
      headers: {
        apikey: env.SUPABASE_STORAGE_SERVICE_KEY,
        Authorization: `Bearer ${env.SUPABASE_STORAGE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expiresIn: 300 }),
      cache: 'no-store',
    })
    if (!response.ok) {
      throw new Error(`Private storage signed-link request failed (${response.status}).`)
    }
    const result = (await response.json()) as { signedURL?: unknown }
    if (typeof result.signedURL !== 'string' || result.signedURL.length === 0) {
      throw new Error('Private storage did not return a signed download URL.')
    }
    const signedURL = new URL(result.signedURL, env.SUPABASE_STORAGE_URL)
    if (signedURL.origin !== new URL(env.SUPABASE_STORAGE_URL).origin) {
      throw new Error('Private storage returned a signed URL on an unexpected host.')
    }
    return NextResponse.redirect(signedURL, 302)
  } catch (error) {
    console.error('Starter Kit download failed.', error)
    return NextResponse.json(
      { error: 'This download link is invalid, expired, or temporarily unavailable.' },
      { status: 503 },
    )
  }
}
