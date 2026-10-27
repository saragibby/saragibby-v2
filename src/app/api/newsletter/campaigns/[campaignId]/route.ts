import { convertLexicalToHTMLAsync } from '@payloadcms/richtext-lexical/html-async'
import { getServerPayload } from '@/lib/server/payload'
import { escapeHTML, sendTransactionalEmail } from '@/lib/server/mail'
import { readJsonBody, RequestValidationError } from '@/lib/server/validation'
import { NextResponse } from 'next/server'
import { z } from 'zod'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const campaignActionSchema = z
  .object({
    action: z.enum(['schedule', 'test']),
    sendAt: z.string().datetime().optional(),
  })
  .strict()

type RouteContext = {
  params: Promise<{ campaignId: string }>
}

export async function POST(request: Request, context: RouteContext) {
  let body: unknown
  try {
    body = await readJsonBody(request)
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof RequestValidationError
            ? error.message
            : 'Request body is invalid.',
      },
      { status: 400 },
    )
  }
  const parsed = campaignActionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid action.' }, { status: 400 })
  }

  try {
    const payload = await getServerPayload()
    const { user } = await payload.auth({
      headers: request.headers,
      canSetHeaders: false,
    })
    if (!user) {
      return NextResponse.json({ error: 'Authentication is required.' }, { status: 401 })
    }
    if (!('role' in user) || user.role !== 'admin') {
      return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
    }

    const { campaignId } = await context.params
    const campaign = await payload.findByID({
      collection: 'newsletter-campaigns',
      id: campaignId,
      overrideAccess: true,
    })

    if (parsed.data.action === 'test') {
      if (!user.email) {
        return NextResponse.json(
          { error: 'The administrator account has no email address for a test send.' },
          { status: 400 },
        )
      }
      const bodyHTML = await convertLexicalToHTMLAsync({ data: campaign.body })
      const previewText = String(campaign.previewText ?? '')
      await sendTransactionalEmail({
        to: user.email,
        subject: `[TEST] ${String(campaign.subject)}`,
        text: previewText || String(campaign.subject),
        html: `<p>${escapeHTML(previewText)}</p>${bodyHTML}`,
      })
      return NextResponse.json({ message: 'Test message sent to your administrator address.' })
    }

    if (
      campaign.status !== 'draft' &&
      campaign.status !== 'failed'
    ) {
      return NextResponse.json(
        { error: 'Only draft or failed campaigns can be scheduled.' },
        { status: 409 },
      )
    }
    const sendAt = parsed.data.sendAt ? new Date(parsed.data.sendAt) : new Date()
    if (parsed.data.sendAt && sendAt.getTime() <= Date.now()) {
      return NextResponse.json({ error: 'Scheduled send time must be in the future.' }, { status: 400 })
    }

    await payload.update({
      collection: 'newsletter-campaigns',
      id: campaign.id,
      data: {
        status: 'scheduled',
        sendAt: sendAt.toISOString(),
        queuedAt: new Date().toISOString(),
        lastError: null,
      },
      overrideAccess: true,
    })
    try {
      await payload.jobs.queue({
        task: 'queue-newsletter',
        input: { campaignId: String(campaign.id) },
        waitUntil: sendAt,
      })
    } catch (error) {
      await payload.update({
        collection: 'newsletter-campaigns',
        id: campaign.id,
        data: {
          status: 'failed',
          lastError:
            error instanceof Error ? error.message.slice(0, 1000) : 'Job queue failed.',
        },
        overrideAccess: true,
      })
      throw error
    }
    return NextResponse.json({ message: 'Newsletter campaign scheduled.' }, { status: 202 })
  } catch (error) {
    console.error('Newsletter campaign action failed.', error)
    return NextResponse.json(
      { error: 'The newsletter campaign action could not be completed.' },
      { status: 503 },
    )
  }
}
