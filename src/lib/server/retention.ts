import type { Payload } from 'payload'

// The retention promises in the privacy policy (/privacy). Change them there
// first, then here.
export const retentionPolicy = {
  /** Signups that never clicked the confirmation link. */
  unconfirmedDays: 30,
  /** Subscriber records after unsubscribing. The suppression stays. */
  unsubscribedDays: 30,
  /** Inquiries after the last activity on them. */
  inquiryDays: 730,
} as const

export type RetentionResult = {
  unconfirmedDeleted: number
  unsubscribedDeleted: number
  inquiriesDeleted: number
  /** Subscribers kept for now because a newsletter they're in is still sending. */
  skippedWhileSending: number
}

const DAY = 24 * 60 * 60 * 1000
const BATCH = 200

function daysBefore(now: Date, days: number) {
  return new Date(now.getTime() - days * DAY).toISOString()
}

/**
 * Removes a subscriber and the records that point at them: their unfinished
 * jobs and their newsletter delivery log. Returns false, deleting nothing,
 * while one of their newsletters is still sending.
 */
async function deleteSubscriber(payload: Payload, id: number): Promise<boolean> {
  const deliveries = await payload.find({
    collection: 'newsletter-deliveries',
    where: { subscriber: { equals: id } },
    depth: 1,
    limit: 0,
    pagination: false,
    overrideAccess: true,
  })
  const sending = deliveries.docs.some(
    (delivery) =>
      typeof delivery.campaign === 'object' && delivery.campaign?.status === 'sending',
  )
  if (sending) return false

  await payload.db.pool.query(
    `DELETE FROM payload_jobs
     WHERE completed_at IS NULL AND input->>'subscriberId' = $1`,
    [String(id)],
  )
  if (deliveries.docs.length) {
    await payload.delete({
      collection: 'newsletter-deliveries',
      where: { subscriber: { equals: id } },
      overrideAccess: true,
    })
  }
  await payload.delete({ collection: 'subscribers', id, overrideAccess: true })
  return true
}

export async function enforceRetention(
  payload: Payload,
  now = new Date(),
): Promise<RetentionResult> {
  const result: RetentionResult = {
    unconfirmedDeleted: 0,
    unsubscribedDeleted: 0,
    inquiriesDeleted: 0,
    skippedWhileSending: 0,
  }

  // Never confirmed, and untouched for 30 days. A delivered kit means they
  // confirmed once (re-adding newsletter consent resets confirmedAt), so
  // those records stay.
  const unconfirmed = await payload.find({
    collection: 'subscribers',
    where: {
      and: [
        { state: { equals: 'pending' } },
        { confirmedAt: { exists: false } },
        { starterKitDeliveryState: { not_equals: 'delivered' } },
        { updatedAt: { less_than: daysBefore(now, retentionPolicy.unconfirmedDays) } },
      ],
    },
    limit: BATCH,
    depth: 0,
    overrideAccess: true,
  })
  for (const subscriber of unconfirmed.docs) {
    if (await deleteSubscriber(payload, subscriber.id)) result.unconfirmedDeleted += 1
    else result.skippedWhileSending += 1
  }

  // Unsubscribed over 30 days ago. Keep the email on the suppression list so
  // they are never emailed again, then delete everything else.
  const unsubscribed = await payload.find({
    collection: 'subscribers',
    where: {
      and: [
        { state: { equals: 'unsubscribed' } },
        { unsubscribedAt: { less_than: daysBefore(now, retentionPolicy.unsubscribedDays) } },
      ],
    },
    limit: BATCH,
    depth: 0,
    overrideAccess: true,
  })
  for (const subscriber of unsubscribed.docs) {
    const suppressed = await payload.count({
      collection: 'suppressions',
      where: { email: { equals: subscriber.email } },
      overrideAccess: true,
    })
    if (suppressed.totalDocs === 0) {
      await payload.create({
        collection: 'suppressions',
        data: {
          email: subscriber.email,
          reason: 'unsubscribe',
          occurredAt: subscriber.unsubscribedAt ?? now.toISOString(),
          source: 'retention',
        },
        overrideAccess: true,
      })
    }
    if (await deleteSubscriber(payload, subscriber.id)) result.unsubscribedDeleted += 1
    else result.skippedWhileSending += 1
  }

  // Inquiries with no activity for 2 years.
  const inquiries = await payload.find({
    collection: 'inquiries',
    where: { updatedAt: { less_than: daysBefore(now, retentionPolicy.inquiryDays) } },
    limit: BATCH,
    depth: 0,
    overrideAccess: true,
  })
  for (const inquiry of inquiries.docs) {
    await payload.db.pool.query(
      `DELETE FROM payload_jobs
       WHERE completed_at IS NULL AND input->>'inquiryId' = $1`,
      [String(inquiry.id)],
    )
    await payload.delete({ collection: 'inquiries', id: inquiry.id, overrideAccess: true })
    result.inquiriesDeleted += 1
  }

  return result
}
