export function assertBackendAvailable(env: NodeJS.ProcessEnv = process.env): void {
  if (env.SITE_PREVIEW === 'true') {
    throw new Error(
      'Backend API, admin, and worker operations are disabled in SITE_PREVIEW mode. Configure production services and disable SITE_PREVIEW to use them.',
    )
  }
}
