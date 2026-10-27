export function isEmailDeliveryEnabled(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return env.EMAIL_DELIVERY_ENABLED !== 'false'
}
