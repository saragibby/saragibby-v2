import './load-env'
import { getServerPayload } from './payload'
import { bootstrapFirstAdmin } from './admin-bootstrap'

async function main(): Promise<void> {
  const payload = await getServerPayload()
  try {
    await bootstrapFirstAdmin(payload, {
      email: process.env.BOOTSTRAP_ADMIN_EMAIL,
      password: process.env.BOOTSTRAP_ADMIN_PASSWORD,
    })
    payload.logger.info('First administrator created by offline bootstrap.')
  } finally {
    delete process.env.BOOTSTRAP_ADMIN_PASSWORD
    await payload.destroy()
  }
}

main().catch((error: unknown) => {
  console.error('Offline administrator bootstrap failed.', error instanceof Error ? error.message : 'Unknown error')
  process.exitCode = 1
})
