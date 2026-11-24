import type { Payload } from 'payload'

export async function resetAdminPassword(
  payload: Pick<Payload, 'find' | 'update'>,
  credentials: { email: string; password: string },
): Promise<void> {
  const { email, password } = credentials
  const { docs } = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })
  if (!docs[0]) throw new Error('No user with that email exists.')

  await payload.update({
    collection: 'users',
    id: docs[0].id,
    data: {
      password,
      loginAttempts: 0,
      lockUntil: null,
      resetPasswordToken: null,
      resetPasswordExpiration: null,
    },
    overrideAccess: true,
  })
}
