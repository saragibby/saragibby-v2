import { createHmac } from 'node:crypto'
import type { Payload } from 'payload'

const WINDOW_SECONDS = 60 * 15
const MAX_ATTEMPTS = 5

export function rateLimitKey(scope: string, address: string, secret: string): string {
  return createHmac('sha256', secret)
    .update(`${scope}:${address}`)
    .digest('hex')
}

export async function consumeRateLimit(
  payload: Payload,
  key: string,
  now = new Date(),
  limit = MAX_ATTEMPTS,
  windowSeconds = WINDOW_SECONDS,
): Promise<boolean> {
  const result = await payload.db.pool.query<{ attempts: number }>(
    `INSERT INTO backend_rate_limits (key_hash, window_started_at, attempts)
     VALUES ($1, $2, 1)
     ON CONFLICT (key_hash) DO UPDATE SET
       attempts = CASE
         WHEN backend_rate_limits.window_started_at <= $2::timestamptz - ($3 * INTERVAL '1 second')
           THEN 1
         ELSE backend_rate_limits.attempts + 1
       END,
       window_started_at = CASE
         WHEN backend_rate_limits.window_started_at <= $2::timestamptz - ($3 * INTERVAL '1 second')
           THEN $2
         ELSE backend_rate_limits.window_started_at
       END
     RETURNING attempts`,
    [key, now.toISOString(), windowSeconds],
  )
  return (result.rows[0]?.attempts ?? limit + 1) <= limit
}

export function clientAddress(request: Request): string {
  const vercelIP = request.headers.get('x-real-ip')
  if (vercelIP) return vercelIP.trim()

  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'

  return 'unknown'
}
