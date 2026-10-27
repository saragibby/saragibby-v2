import '../lib/server/load-env'
import { getServerPayload } from '../lib/server/payload'
import { biography } from '../lib/site/biography'
import { richText } from '../lib/site/plain-rich-text'

async function main() {
  if (process.env.UPDATE_BIOGRAPHY !== 'true') {
    throw new Error('Set UPDATE_BIOGRAPHY=true to apply the pending biography copy.')
  }
  const payload = await getServerPayload()
  try {
    const about = await payload.find({
      collection: 'pages', where: { slug: { equals: 'about' } }, limit: 1,
    })
    if (!about.docs[0]) {
      throw new Error('About page does not exist. Create it before applying this copy update.')
    }
    await payload.updateGlobal({
      slug: 'homepage',
      data: { story: { body: richText(biography) } },
    })
    await payload.update({
      collection: 'pages',
      id: about.docs[0].id,
      data: { body: richText(biography) },
    })
    console.info('Homepage and About biography updated; other content preserved.')
  } finally {
    await payload.destroy()
  }
}

main().then(() => process.exit(0)).catch((error: unknown) => {
  console.error('Biography update failed:', error instanceof Error ? error.message : 'Unexpected failure.')
  process.exit(1)
})
