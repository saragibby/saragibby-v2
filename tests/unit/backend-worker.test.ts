import { describe, expect, it, vi } from 'vitest'
import { runPayloadWorker } from '../../src/lib/server/worker'

function fixture() {
  const controller = new AbortController()
  const payload = {
    jobs: {
      handleSchedules: vi.fn().mockResolvedValue({ errored: [], queued: [], skipped: [] }),
      run: vi.fn().mockResolvedValue({ noJobsRemaining: true, remainingJobsFromQueried: 0 }),
    },
    logger: { info: vi.fn() },
    destroy: vi.fn().mockResolvedValue(undefined),
  }
  return { payload, controller }
}

describe('standalone worker shutdown', () => {
  it('finishes its in-flight batch before destroying Payload', async () => {
    const { payload, controller } = fixture()
    payload.jobs.run.mockImplementationOnce(async () => {
      controller.abort()
      expect(payload.destroy).not.toHaveBeenCalled()
      return { noJobsRemaining: true, remainingJobsFromQueried: 0 }
    })
    await runPayloadWorker(payload, controller.signal)
    expect(payload.jobs.run).toHaveBeenCalledExactlyOnceWith({
      allQueues: true, limit: 10, overrideAccess: true,
    })
    expect(payload.destroy).toHaveBeenCalledOnce()
  })

  it('interrupts idle sleep and releases connections on shutdown', async () => {
    const { payload, controller } = fixture()
    const running = runPayloadWorker(payload, controller.signal)
    await vi.waitFor(() => expect(payload.jobs.run).toHaveBeenCalledOnce())
    controller.abort()
    await running
    expect(payload.destroy).toHaveBeenCalledOnce()
  })

  it('releases connections and propagates worker errors', async () => {
    const { payload, controller } = fixture()
    payload.jobs.run.mockRejectedValueOnce(new Error('database connection lost'))
    await expect(runPayloadWorker(payload, controller.signal)).rejects.toThrow('database connection lost')
    expect(payload.destroy).toHaveBeenCalledOnce()
  })
})
