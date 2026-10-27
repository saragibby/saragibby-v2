import 'payload'

declare module 'payload' {
  interface GeneratedTypes {
    jobs: {
      tasks: {
        'send-confirmation': {
          input: { subscriberId: string }
          output: { sent: boolean }
        }
        'send-starter-kit': {
          input: { subscriberId: string }
          output: { sent: boolean }
        }
        'notify-inquiry': {
          input: { inquiryId: string }
          output: { sent: boolean }
        }
        'queue-newsletter': {
          input: { campaignId: string }
          output: { queued: number }
        }
        'send-newsletter-recipient': {
          input: { campaignId: string; subscriberId: string }
          output: { sent: boolean; skipped?: boolean }
        }
        'prune-rate-limits': {
          input: Record<string, never>
          output: { deleted: number }
        }
      }
      workflows: Record<string, never>
    }
  }
}
