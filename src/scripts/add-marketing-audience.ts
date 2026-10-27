import '../lib/server/load-env'
import { getServerPayload } from '../lib/server/payload'

async function main() {
  if (process.env.UPDATE_HOMEPAGE_AUDIENCES !== 'true') {
    throw new Error('Set UPDATE_HOMEPAGE_AUDIENCES=true to apply the pending audience tag.')
  }
  const payload = await getServerPayload()
  try {
    const home = await payload.findGlobal({ slug: 'homepage', depth: 0 })
    const audiences = home.audiences ?? []
    const label = 'Marketing tech and AI tooling'
    if (audiences.some((audience) => audience.label === label)) {
      console.info('Audience tag already exists; no changes made.')
      return
    }
    if (audiences.length >= 12) {
      throw new Error('Homepage already has the maximum of 12 audience tags. Review in admin.')
    }
    await payload.updateGlobal({
      slug: 'homepage',
      data: { audiences: [...audiences, { label }] },
    })
    console.info('Audience tag added; existing tags preserved.')
  } finally {
    await payload.destroy()
  }
}

main().then(() => process.exit(0)).catch((error: unknown) => {
  console.error('Audience update failed:', error instanceof Error ? error.message : 'Unexpected failure.')
  process.exit(1)
})
