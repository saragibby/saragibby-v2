import { setTimeout } from 'node:timers/promises'
import type { Payload } from 'payload'

type WorkerPayload = {
  jobs: Pick<Payload['jobs'], 'run' | 'handleSchedules'>
  logger: Pick<Payload['logger'], 'info'>
  destroy: Payload['destroy']
}

export async function runPayloadWorker(
  payload: WorkerPayload,
  signal: AbortSignal,
): Promise<void> {
  let lastScheduleCheck = 0
  payload.logger.info('Payload jobs worker started.')
  try {
    while (!signal.aborted) {
      if (Date.now() - lastScheduleCheck >= 60_000) {
        await payload.jobs.handleSchedules({ allQueues: true })
        lastScheduleCheck = Date.now()
      }
      if (signal.aborted) break
      const result = await payload.jobs.run({
        allQueues: true,
        limit: 10,
        overrideAccess: true,
      })
      if (result.noJobsRemaining && !signal.aborted) {
        try {
          await setTimeout(1_500, undefined, { signal })
        } catch (error) {
          if (!(error instanceof Error && error.name === 'AbortError' && signal.aborted)) {
            throw error
          }
        }
      }
    }
  } finally {
    await payload.destroy()
    payload.logger.info('Payload jobs worker stopped.')
  }
}
