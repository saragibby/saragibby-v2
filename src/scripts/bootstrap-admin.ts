import "../lib/server/load-env"
import { getServerPayload } from "../lib/server/payload"
import { bootstrapFirstAdmin } from "../lib/server/admin-bootstrap"

async function main() {
  const credentials = {
    email: process.env.BOOTSTRAP_ADMIN_EMAIL,
    password: process.env.BOOTSTRAP_ADMIN_PASSWORD,
  }
  delete process.env.BOOTSTRAP_ADMIN_EMAIL
  delete process.env.BOOTSTRAP_ADMIN_PASSWORD
  const payload = await getServerPayload()
  try {
    await bootstrapFirstAdmin(payload, credentials)
    console.info("First administrator created. Remove bootstrap credentials from your environment.")
  } finally {
    await payload.destroy()
  }
}

main().catch((error: unknown) => {
  console.error(
    "Administrator bootstrap failed:",
    error instanceof Error ? error.message : "Unexpected bootstrap failure."
  )
  process.exitCode = 1
})
