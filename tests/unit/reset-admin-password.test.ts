import type { Payload } from 'payload'
import { describe, expect, it, vi } from 'vitest'
import { resetAdminPassword } from '../../src/lib/server/reset-admin-password'

function createPayloadMock(userID?: number) {
  const payload = {
    find: vi.fn().mockResolvedValue({
      docs: userID === undefined ? [] : [{ id: userID }],
    }),
    update: vi.fn().mockResolvedValue({}),
  } as Pick<Payload, 'find' | 'update'>

  return payload
}

describe('resetAdminPassword', () => {
  it('updates the password, clears lock state, and invalidates outstanding reset tokens', async () => {
    const payload = createPayloadMock(42)

    await resetAdminPassword(payload, {
      email: 'admin@example.test',
      password: 'a-secure-password-that-is-long-enough',
    })

    expect(payload.find).toHaveBeenCalledWith({
      collection: 'users',
      where: { email: { equals: 'admin@example.test' } },
      limit: 1,
      overrideAccess: true,
    })
    expect(payload.update).toHaveBeenCalledWith({
      collection: 'users',
      id: 42,
      data: {
        password: 'a-secure-password-that-is-long-enough',
        loginAttempts: 0,
        lockUntil: null,
        resetPasswordToken: null,
        resetPasswordExpiration: null,
      },
      overrideAccess: true,
    })
  })

  it('refuses to update when no matching user exists', async () => {
    const payload = createPayloadMock()

    await expect(
      resetAdminPassword(payload, {
        email: 'missing@example.test',
        password: 'a-secure-password-that-is-long-enough',
      }),
    ).rejects.toThrow('No user with that email exists.')

    expect(payload.update).not.toHaveBeenCalled()
  })
})
