import './lib/server/load-env'
import { getPayload } from 'payload'
import { runPayloadWorker } from './lib/server/worker'

const controller = new AbortController()
const shutdown = () => controller.abort()

async function runWorker(): Promise<void> {
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
  try {
    const { default: config } = await import('@payload-config')
    const payload = await getPayload({ config })
    await runPayloadWorker(payload, controller.signal)
  } finally {
    process.off('SIGINT', shutdown)
    process.off('SIGTERM', shutdown)
  }
}

runWorker().catch((error: unknown) => {
  console.error('Payload jobs worker failed.', error)
  process.exitCode = 1
})
