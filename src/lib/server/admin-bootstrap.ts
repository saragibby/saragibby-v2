import type { Payload } from 'payload'
import { z } from 'zod'

export const offlineBootstrapCapability = Symbol('offline-admin-bootstrap')

export const bootstrapCredentialsSchema = z.object({
  email: z.string().trim().email().transform((email) => email.toLowerCase()),
  password: z.string().min(16).max(128),
})

export async function bootstrapFirstAdmin(payload: Payload, credentials: unknown): Promise<void> {
  const data = bootstrapCredentialsSchema.parse(credentials)
  const lock = await payload.db.pool.connect()
  try {
    await lock.query('SELECT pg_advisory_lock(7425, 1414)')
    const users = await payload.count({ collection: 'users', overrideAccess: true })
    if (users.totalDocs !== 0) {
      throw new Error('Offline bootstrap is only permitted when the users collection is empty.')
    }
    await payload.create({
      collection: 'users',
      data: { ...data, role: 'admin' },
      context: { offlineAdminBootstrap: offlineBootstrapCapability },
      overrideAccess: true,
    })
  } finally {
    try {
      await lock.query('SELECT pg_advisory_unlock(7425, 1414)')
    } finally {
      lock.release()
    }
  }
}
