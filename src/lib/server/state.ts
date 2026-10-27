export type SubscriberState = 'pending' | 'confirmed' | 'unsubscribed'

export type SubscriberConsentState =
  | 'pending'
  | 'consented'
  | 'not-consented'
  | 'withdrawn'

export const CONFIRMATION_RESEND_COOLDOWN_MS = 15 * 60 * 1000

export function isConfirmationResendDue(
  sentAt: string | null | undefined,
  now = Date.now(),
): boolean {
  if (!sentAt) return true
  const sentAtMilliseconds = Date.parse(sentAt)
  return (
    Number.isFinite(sentAtMilliseconds) &&
    now - sentAtMilliseconds >= CONFIRMATION_RESEND_COOLDOWN_MS
  )
}

export function canReceiveNewsletter(input: {
  state: SubscriberState
  consentState: SubscriberConsentState
  suppressed: boolean
}): boolean {
  return (
    input.state === 'confirmed' &&
    input.consentState === 'consented' &&
    !input.suppressed
  )
}

export function shouldSendConfirmation(input: {
  state: SubscriberState
  consentState: SubscriberConsentState
  starterKitRequested: boolean
  suppressed: boolean
}): boolean {
  return (
    input.state === 'pending' &&
    !input.suppressed &&
    (input.consentState === 'pending' || input.starterKitRequested)
  )
}

export function transitionToConfirmed(input: {
  state: SubscriberState
  consentState: SubscriberConsentState
  marketingConsent: boolean
}): { state: 'confirmed'; consentState: SubscriberConsentState } {
  return {
    state: 'confirmed',
    consentState: input.marketingConsent ? 'consented' : 'not-consented',
  }
}
