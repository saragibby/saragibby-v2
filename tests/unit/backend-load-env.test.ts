import { afterEach, describe, expect, it, vi } from 'vitest'

const loadEnvFile = vi.hoisted(() => vi.fn())
vi.mock('node:process', () => ({ loadEnvFile }))

afterEach(() => {
  vi.resetModules()
  loadEnvFile.mockReset()
})

describe('standalone environment loading', () => {
  it('loads the root .env using the native Node loader', async () => {
    await import('../../src/lib/server/load-env')
    expect(loadEnvFile).toHaveBeenCalledExactlyOnceWith()
  })

  it('permits injected environment configuration without a .env file', async () => {
    loadEnvFile.mockImplementation(() => {
      throw Object.assign(new Error('file missing'), { code: 'ENOENT' })
    })
    await expect(import('../../src/lib/server/load-env')).resolves.toBeDefined()
  })

  it('does not silently ignore unreadable environment files', async () => {
    loadEnvFile.mockImplementation(() => {
      throw Object.assign(new Error('permission denied'), { code: 'EACCES' })
    })
    await expect(import('../../src/lib/server/load-env')).rejects.toThrow('permission denied')
  })
})
