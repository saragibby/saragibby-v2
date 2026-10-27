import { SignJWT, jwtVerify } from 'jose'

export type EmailTokenPurpose = 'confirm' | 'unsubscribe' | 'download'

export type EmailTokenClaims = {
  purpose: EmailTokenPurpose
  subscriberId: string
  assetId?: string
}

const TOKEN_ISSUER = 'saragibby.com'

function signingKey(secret: string): Uint8Array {
  if (secret.length < 32) {
    throw new Error('EMAIL_SIGNING_SECRET must contain at least 32 characters.')
  }
  return new TextEncoder().encode(secret)
}

export async function signEmailToken(
  claims: EmailTokenClaims,
  secret: string,
  expiresIn: string,
  now = new Date(),
): Promise<string> {
  const duration = /^([1-9]\d*)([smhd])$/.exec(expiresIn)
  if (!duration) throw new Error('Email token duration must be a positive number of seconds, minutes, hours, or days.')
  const units: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 }
  const issuedAt = Math.floor(now.getTime() / 1000)
  const expiration = issuedAt + Number(duration[1]) * units[duration[2]]
  if (!Number.isSafeInteger(expiration)) throw new Error('Email token expiration is invalid.')
  return new SignJWT({
    purpose: claims.purpose,
    subscriberId: claims.subscriberId,
    ...(claims.assetId ? { assetId: claims.assetId } : {}),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(TOKEN_ISSUER)
    .setAudience('email-action')
    .setIssuedAt(issuedAt)
    .setExpirationTime(expiration)
    .sign(signingKey(secret))
}

export async function verifyEmailToken(
  token: string,
  expectedPurpose: EmailTokenPurpose,
  secret: string,
  now = new Date(),
): Promise<EmailTokenClaims> {
  const { payload } = await jwtVerify(token, signingKey(secret), {
    issuer: TOKEN_ISSUER,
    audience: 'email-action',
    currentDate: now,
    algorithms: ['HS256'],
  })
  if (
    payload.purpose !== expectedPurpose ||
    typeof payload.subscriberId !== 'string' ||
    payload.subscriberId.length === 0 ||
    (expectedPurpose === 'download' &&
      (typeof payload.assetId !== 'string' || payload.assetId.length === 0))
  ) {
    throw new Error('The email action token is invalid.')
  }
  return {
    purpose: expectedPurpose,
    subscriberId: payload.subscriberId,
    ...(typeof payload.assetId === 'string' ? { assetId: payload.assetId } : {}),
  }
}
