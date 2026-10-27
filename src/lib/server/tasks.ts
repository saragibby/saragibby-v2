import type { Payload, TaskConfig } from 'payload'
import { convertLexicalToHTMLAsync } from '@payloadcms/richtext-lexical/html-async'
import { canReceiveNewsletter, shouldSendConfirmation } from './state'
import { escapeHTML, sendTransactionalEmail } from './mail'
import { getContactEmail, getTokenEnvironment } from './env'
import { signEmailToken } from './tokens'
import { isUniqueConstraintError } from './errors'
import type { Subscriber } from '@/payload-types'

type TaskIO<I extends object, O extends object> = {
  input: I
  output: O
}

type SendConfirmationTask = TaskIO<
  { subscriberId: string },
  { sent: boolean }
>
type SendKitTask = TaskIO<{ subscriberId: string }, { sent: boolean }>
type NotifyInquiryTask = TaskIO<{ inquiryId: string }, { sent: boolean }>
type QueueNewsletterTask = TaskIO<{ campaignId: string }, { queued: number }>
type SendNewsletterRecipientTask = TaskIO<
  { campaignId: string; subscriberId: string },
  { sent: boolean; skipped?: boolean }
>
type PruneRateLimitsTask = TaskIO<Record<string, never>, { deleted: number }>
type PayloadTaskConfig =
  | TaskConfig<SendConfirmationTask>
  | TaskConfig<SendKitTask>
  | TaskConfig<NotifyInquiryTask>
  | TaskConfig<QueueNewsletterTask>
  | TaskConfig<SendNewsletterRecipientTask>
  | TaskConfig<PruneRateLimitsTask>

function lexicalHTML(data: unknown): Promise<string> {
  if (!data || typeof data !== 'object') {
    throw new Error('Newsletter content is missing or invalid.')
  }
  return convertLexicalToHTMLAsync({ data: data as Parameters<typeof convertLexicalToHTMLAsync>[0]['data'] })
}

const retryPolicy = { attempts: 5, backoff: { type: 'exponential' as const, delay: 30_000 } }

async function isSuppressed(payload: Payload, email: string): Promise<boolean> {
  const found = await payload.find({
    collection: 'suppressions',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })
  return found.docs.length > 0
}

async function finalizeCampaignIfComplete(
  payload: Payload,
  campaignId: string | number,
): Promise<void> {
  const campaign = await payload.findByID({
    collection: 'newsletter-campaigns',
    id: campaignId,
    overrideAccess: true,
  })
  if (campaign.status !== 'sending' || !campaign.queueingComplete) return

  const completed = await payload.count({
    collection: 'newsletter-deliveries',
    where: {
      and: [
        { campaign: { equals: campaignId } },
        { status: { in: ['sent', 'skipped'] } },
      ],
    },
    overrideAccess: true,
  })
  if (completed.totalDocs === campaign.queuedRecipientCount) {
    await payload.update({
      collection: 'newsletter-campaigns',
      id: campaign.id,
      data: { status: 'sent', sentAt: new Date().toISOString(), lastError: null },
      overrideAccess: true,
    })
  }
}

export function createPayloadTasks(): PayloadTaskConfig[] {
  const sendConfirmation: TaskConfig<SendConfirmationTask> = {
    slug: 'send-confirmation',
    label: 'Send signup confirmation',
    retries: retryPolicy,
    concurrency: ({ input }) => `confirmation:${input.subscriberId}`,
    handler: async ({ input, req }) => {
      const subscriber: Subscriber = await req.payload.findByID({
        collection: 'subscribers',
        id: input.subscriberId,
        overrideAccess: true,
      })

      const suppressed = await isSuppressed(req.payload, subscriber.email)
      if (
        subscriber.confirmationSentAt ||
        !shouldSendConfirmation({
          state: subscriber.state,
          consentState: subscriber.consentState,
          starterKitRequested: subscriber.starterKitRequested,
          suppressed,
        })
      ) {
        return { output: { sent: false } }
      }

      const tokenEnv = getTokenEnvironment()
      const token = await signEmailToken(
        { purpose: 'confirm', subscriberId: String(subscriber.id) },
        tokenEnv.EMAIL_SIGNING_SECRET,
        '48h',
      )
      const confirmationURL = new URL('/api/confirm', tokenEnv.SITE_URL)
      confirmationURL.searchParams.set('token', token)
      const escapedURL = escapeHTML(confirmationURL.toString())

      try {
        await sendTransactionalEmail({
          to: subscriber.email,
          subject: 'Confirm your signup',
          text: `Confirm your email address: ${confirmationURL.toString()}`,
          html: `<p>Confirm your email address to finish signing up.</p><p><a href="${escapedURL}">Confirm email</a></p>`,
        })
        await req.payload.update({
          collection: 'subscribers',
          id: subscriber.id,
          data: { confirmationSentAt: new Date().toISOString(), lastEmailError: null },
          overrideAccess: true,
        })
      } catch (error) {
        await req.payload.update({
          collection: 'subscribers',
          id: subscriber.id,
          data: {
            lastEmailError:
              error instanceof Error ? error.message.slice(0, 1000) : 'Confirmation email failed.',
          },
          overrideAccess: true,
        })
        throw error
      }
      return { output: { sent: true } }
    },
  }

  const sendKit: TaskConfig<SendKitTask> = {
    slug: 'send-starter-kit',
    label: 'Send Starter Kit delivery',
    retries: retryPolicy,
    concurrency: ({ input }) => `starter-kit:${input.subscriberId}`,
    handler: async ({ input, req }) => {
      const subscriber: Subscriber = await req.payload.findByID({
        collection: 'subscribers',
        id: input.subscriberId,
        overrideAccess: true,
      })
      if (
        !subscriber.confirmedAt ||
        !subscriber.starterKitRequested ||
        subscriber.starterKitDeliveryState === 'delivered'
      ) {
        return { output: { sent: false } }
      }

      const tokenEnv = getTokenEnvironment()
      const kit = await req.payload.findGlobal({
        slug: 'starterKit',
        depth: 1,
        overrideAccess: true,
      })
      const assets = (kit.assets ?? []).map((asset) => {
        if (typeof asset === 'number') {
          throw new Error('Starter Kit asset relations must be populated before delivery.')
        }
        return asset
      })
      if (assets.length === 0) {
        throw new Error('Starter Kit has no configured delivery assets.')
      }

      const links = await Promise.all(
        assets.map(async (asset) => {
          const token = await signEmailToken(
            {
              purpose: 'download',
              subscriberId: String(subscriber.id),
              assetId: String(asset.id),
            },
            tokenEnv.EMAIL_SIGNING_SECRET,
            '7d',
          )
          const url = new URL('/api/download', tokenEnv.SITE_URL)
          url.searchParams.set('token', token)
          return { name: asset.filename ?? 'Starter Kit file', url: url.toString() }
        }),
      )
      const list = links
        .map(
          ({ name, url }) =>
            `<li><a href="${escapeHTML(url)}">${escapeHTML(name)}</a></li>`,
        )
        .join('')
      const description = String(kit.deliveryCopy ?? '')

      await req.payload.update({
        collection: 'subscribers',
        id: subscriber.id,
        data: { starterKitDeliveryState: 'queued', lastEmailError: null },
        overrideAccess: true,
      })
      try {
        await sendTransactionalEmail({
          to: subscriber.email,
          subject: String(kit.title ?? 'Your Starter Kit'),
          text: `${description}\n\n${links.map(({ name, url }) => `${name}: ${url}`).join('\n')}`,
          html: `<p>${escapeHTML(description)}</p><ul>${list}</ul>`,
        })
        await req.payload.update({
          collection: 'subscribers',
          id: subscriber.id,
          data: { starterKitDeliveryState: 'delivered', lastEmailError: null },
          overrideAccess: true,
        })
      } catch (error) {
        await req.payload.update({
          collection: 'subscribers',
          id: subscriber.id,
          data: {
            starterKitDeliveryState: 'failed',
            lastEmailError:
              error instanceof Error ? error.message.slice(0, 1000) : 'Email delivery failed.',
          },
          overrideAccess: true,
        })
        throw error
      }
      return { output: { sent: true } }
    },
  }

  const notifyInquiry: TaskConfig<NotifyInquiryTask> = {
    slug: 'notify-inquiry',
    label: 'Notify about consulting inquiry',
    retries: retryPolicy,
    concurrency: ({ input }) => `inquiry:${input.inquiryId}`,
    handler: async ({ input, req }) => {
      const inquiry = await req.payload.findByID({
        collection: 'inquiries',
        id: input.inquiryId,
        overrideAccess: true,
      })
      try {
        await sendTransactionalEmail({
          to: getContactEmail(),
          subject: `New consulting inquiry from ${String(inquiry.name)}`,
          text: [
            `Name: ${String(inquiry.name)}`,
            `Email: ${String(inquiry.email)}`,
            `Company: ${String(inquiry.company ?? 'Not provided')}`,
            `Project type: ${inquiry.projectType ?? 'Not provided'}`,
            '',
            String(inquiry.message),
          ].join('\n'),
          html: `<p><strong>${escapeHTML(String(inquiry.name))}</strong> (${escapeHTML(String(inquiry.email))})</p><p>${escapeHTML(inquiry.projectType ?? 'Not provided')}</p><p>${escapeHTML(String(inquiry.message)).replace(/\n/g, '<br>')}</p>`,
        })
        await req.payload.update({
          collection: 'inquiries',
          id: input.inquiryId,
          data: { notificationState: 'sent', notificationError: null },
          overrideAccess: true,
        })
      } catch (error) {
        await req.payload.update({
          collection: 'inquiries',
          id: input.inquiryId,
          data: {
            notificationState: 'failed',
            notificationError:
              error instanceof Error ? error.message.slice(0, 1000) : 'Notification failed.',
          },
          overrideAccess: true,
        })
        throw error
      }
      return { output: { sent: true } }
    },
  }

  const queueNewsletter: TaskConfig<QueueNewsletterTask> = {
    slug: 'queue-newsletter',
    label: 'Queue newsletter campaign',
    retries: retryPolicy,
    concurrency: ({ input }) => `newsletter-campaign:${input.campaignId}`,
    handler: async ({ input, req }) => {
      const campaign = await req.payload.findByID({
        collection: 'newsletter-campaigns',
        id: input.campaignId,
        overrideAccess: true,
      })
      if (campaign.status !== 'scheduled' && campaign.status !== 'sending') {
        return { output: { queued: 0 } }
      }
      const deliveryCount = await req.payload.count({
        collection: 'newsletter-deliveries',
        where: { campaign: { equals: campaign.id } },
        overrideAccess: true,
      })
      let queued = deliveryCount.totalDocs
      await req.payload.update({
        collection: 'newsletter-campaigns',
        id: campaign.id,
        data: {
          status: 'sending',
          queuedAt: campaign.queuedAt ?? new Date().toISOString(),
          queuedRecipientCount: queued,
          queueingComplete: false,
          lastError: null,
        },
        overrideAccess: true,
      })
      let page = 1
      let hasNextPage = true
      while (hasNextPage) {
        const recipients = await req.payload.find({
          collection: 'subscribers',
          where: {
            and: [
              { state: { equals: 'confirmed' } },
              { consentState: { equals: 'consented' } },
              { marketingConsent: { equals: true } },
            ],
          },
          limit: 100,
          page,
          overrideAccess: true,
        })
        for (const recipient of recipients.docs) {
          const deliveryKey = `${campaign.id}:${recipient.id}`
          const existing = await req.payload.find({
            collection: 'newsletter-deliveries',
            where: { deliveryKey: { equals: deliveryKey } },
            limit: 1,
            overrideAccess: true,
          })
          let delivery = existing.docs[0]
          if (!delivery) {
            try {
              delivery = await req.payload.create({
                collection: 'newsletter-deliveries',
                data: {
                  deliveryKey,
                  campaign: campaign.id,
                  subscriber: recipient.id,
                  status: 'queued',
                },
                overrideAccess: true,
              })
              queued += 1
              await req.payload.update({
                collection: 'newsletter-campaigns',
                id: campaign.id,
                data: { queuedRecipientCount: queued },
                overrideAccess: true,
              })
            } catch (error) {
              if (!isUniqueConstraintError(error)) throw error
              const racedDelivery = await req.payload.find({
                collection: 'newsletter-deliveries',
                where: { deliveryKey: { equals: deliveryKey } },
                limit: 1,
                overrideAccess: true,
              })
              delivery = racedDelivery.docs[0]
              if (!delivery) throw error
            }
          }
          if (delivery.status !== 'sent') {
            if (delivery.status === 'skipped') {
              await req.payload.update({
                collection: 'newsletter-deliveries',
                id: delivery.id,
                data: { status: 'queued', lastError: null },
                overrideAccess: true,
              })
            }
            await req.payload.jobs.queue({
              task: 'send-newsletter-recipient',
              input: {
                campaignId: String(campaign.id),
                subscriberId: String(recipient.id),
              },
            })
          }
        }
        hasNextPage = recipients.hasNextPage
        page += 1
      }
      await req.payload.update({
        collection: 'newsletter-campaigns',
        id: campaign.id,
        data: { queueingComplete: true },
        overrideAccess: true,
      })
      if (queued === 0) {
        await req.payload.update({
          collection: 'newsletter-campaigns',
          id: campaign.id,
          data: { status: 'sent', sentAt: new Date().toISOString() },
          overrideAccess: true,
        })
      } else {
        await finalizeCampaignIfComplete(req.payload, campaign.id)
      }
      return { output: { queued } }
    },
    onFail: async ({ input, req }) => {
      if (!input || !('campaignId' in input) || typeof input.campaignId !== 'string') {
        return
      }
      await req.payload.update({
        collection: 'newsletter-campaigns',
        id: input.campaignId,
        data: {
          status: 'failed',
          lastError: 'The campaign recipient list could not be queued.',
        },
        overrideAccess: true,
      })
    },
  }

  const sendNewsletterRecipient: TaskConfig<SendNewsletterRecipientTask> = {
    slug: 'send-newsletter-recipient',
    label: 'Send newsletter to subscriber',
    retries: retryPolicy,
    concurrency: ({ input }) =>
      `newsletter-recipient:${input.campaignId}:${input.subscriberId}`,
    handler: async ({ input, req }) => {
      const [campaign, subscriber] = await Promise.all([
        req.payload.findByID({
          collection: 'newsletter-campaigns',
          id: input.campaignId,
          overrideAccess: true,
        }),
        req.payload.findByID({
          collection: 'subscribers',
          id: input.subscriberId,
          overrideAccess: true,
        }),
      ])
      const person = subscriber
      const deliveryKey = `${campaign.id}:${person.id}`
      const existing = await req.payload.find({
        collection: 'newsletter-deliveries',
        where: { deliveryKey: { equals: deliveryKey } },
        limit: 1,
        overrideAccess: true,
      })
      if (
        existing.docs.some(
          (delivery) => delivery.status === 'sent' || delivery.status === 'skipped',
        )
      ) {
        return { output: { sent: false, skipped: true } }
      }

      let deliveryId: string | number
      const existingDelivery = existing.docs[0]
      if (existingDelivery) {
        deliveryId = existingDelivery.id
        await req.payload.update({
          collection: 'newsletter-deliveries',
          id: deliveryId,
          data: { status: 'sending', lastError: null },
          overrideAccess: true,
        })
      } else {
        const delivery = await req.payload.create({
          collection: 'newsletter-deliveries',
          data: {
            deliveryKey,
            campaign: campaign.id,
            subscriber: person.id,
            status: 'sending',
          },
          overrideAccess: true,
        })
        deliveryId = delivery.id
      }

      try {
        const suppressed = await isSuppressed(req.payload, person.email)
        if (
          (campaign.status !== 'sending' && campaign.status !== 'failed') ||
          !canReceiveNewsletter({
            state: person.state,
            consentState: person.consentState,
            suppressed,
          }) ||
          !person.marketingConsent
        ) {
          await req.payload.update({
            collection: 'newsletter-deliveries',
            id: deliveryId,
            data: { status: 'skipped' },
            overrideAccess: true,
          })
          await finalizeCampaignIfComplete(req.payload, campaign.id)
          return { output: { sent: false, skipped: true } }
        }

        const tokenEnv = getTokenEnvironment()
        const unsubscribeToken = await signEmailToken(
          { purpose: 'unsubscribe', subscriberId: String(person.id) },
          tokenEnv.EMAIL_SIGNING_SECRET,
          '365d',
        )
        const unsubscribeURL = new URL('/api/unsubscribe', tokenEnv.SITE_URL)
        unsubscribeURL.searchParams.set('token', unsubscribeToken)
        const emailHTML = await lexicalHTML(campaign.body)
        const safePreview = escapeHTML(String(campaign.previewText ?? ''))
        await sendTransactionalEmail({
          to: person.email,
          subject: String(campaign.subject),
          text: `${String(campaign.previewText ?? '')}\n\n${unsubscribeURL.toString()}`,
          html: `<p>${safePreview}</p>${emailHTML}<p><a href="${escapeHTML(unsubscribeURL.toString())}">Unsubscribe</a></p>`,
          headers: {
            'List-Unsubscribe': `<${unsubscribeURL.toString()}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        })
        await req.payload.update({
          collection: 'newsletter-deliveries',
          id: deliveryId,
          data: { status: 'sent', sentAt: new Date().toISOString() },
          overrideAccess: true,
        })
        await finalizeCampaignIfComplete(req.payload, campaign.id)
      } catch (error) {
        await req.payload.update({
          collection: 'newsletter-deliveries',
          id: deliveryId,
          data: {
            status: 'failed',
            lastError:
              error instanceof Error ? error.message.slice(0, 1000) : 'Email delivery failed.',
          },
          overrideAccess: true,
        })
        throw error
      }
      return { output: { sent: true } }
    },
    onFail: async ({ input, req }) => {
      if (!input || !('campaignId' in input) || typeof input.campaignId !== 'string') {
        return
      }
      await req.payload.update({
        collection: 'newsletter-campaigns',
        id: input.campaignId,
        data: {
          status: 'failed',
          lastError: 'A newsletter recipient delivery exhausted its retry attempts.',
        },
        overrideAccess: true,
      })
    },
  }

  const pruneRateLimits: TaskConfig<PruneRateLimitsTask> = {
    slug: 'prune-rate-limits',
    label: 'Prune expired rate limit records',
    schedule: [{ cron: '17 3 * * *', queue: 'maintenance' }],
    handler: async ({ req }) => {
      const result = await req.payload.db.pool.query(
        `DELETE FROM backend_rate_limits
         WHERE window_started_at < now() - INTERVAL '2 days'`,
      )
      return { output: { deleted: result.rowCount ?? 0 } }
    },
  }

  return [
    sendConfirmation,
    sendKit,
    notifyInquiry,
    queueNewsletter,
    sendNewsletterRecipient,
    pruneRateLimits,
  ]
}
