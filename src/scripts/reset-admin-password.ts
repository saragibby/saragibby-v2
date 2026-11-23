import "../lib/server/load-env"
import { getServerPayload } from "../lib/server/payload"
import { bootstrapCredentialsSchema } from "../lib/server/admin-bootstrap"

// Offline password reset for an existing admin, for when reset emails can't be
// sent. Credentials come from the environment, never command-line arguments.
async function main() {
  const { email, password } = bootstrapCredentialsSchema.parse({
    email: process.env.RESET_ADMIN_EMAIL,
    password: process.env.RESET_ADMIN_PASSWORD,
  })
  delete process.env.RESET_ADMIN_EMAIL
  delete process.env.RESET_ADMIN_PASSWORD

  const payload = await getServerPayload()
  try {
    const { docs } = await payload.find({
      collection: "users",
      where: { email: { equals: email } },
      limit: 1,
      overrideAccess: true,
    })
    if (!docs[0]) throw new Error("No user with that email exists.")
    await payload.update({
      collection: "users",
      id: docs[0].id,
      data: { password, loginAttempts: 0, lockUntil: null },
      overrideAccess: true,
    })
    console.info(
      "Password reset and account unlocked. Remove the reset credentials from your environment."
    )
  } finally {
    await payload.destroy()
  }
}

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(
      "Password reset failed:",
      error instanceof Error ? error.message : "Unexpected failure."
    )
    process.exit(1)
  })
