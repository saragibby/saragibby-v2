import { contactEmail, kitName } from "./site-navigation"

// Every "not open yet" message for signup and inquiry forms lives here, and
// the API routes return the same words. The forms open when
// EMAIL_DELIVERY_ENABLED is on and the privacy page is owner-approved. Once
// they are open for good, delete these notices and their FormNotice uses.
export const formNotices = {
  signup: "Almost ready. I’m still testing the pipes.",
  inquiry: `Online inquiries are almost ready. I’m still testing the pipes. Until then, email ${contactEmail}.`,
  kit: `The free ${kitName} is almost ready. Check back soon.`,
} as const

export type FormNoticeKind = keyof typeof formNotices

export type FormPolicy = {
  /** EMAIL_DELIVERY_ENABLED is not "false". */
  deliveryEnabled: boolean
  /** The privacy page is owner-approved (always true in SITE_PREVIEW). */
  enabled: boolean
  /** The Starter Kit has a title and version in Payload. */
  kitReady: boolean
}

/** Returns the notice to show instead of the form, or null when it is open. */
export function closedFormNotice(
  policy: FormPolicy,
  form: "signup" | "kit" | "inquiry"
): FormNoticeKind | null {
  const kind = form === "inquiry" ? "inquiry" : "signup"
  if (!policy.deliveryEnabled || !policy.enabled) return kind
  if (form === "kit" && !policy.kitReady) return "kit"
  return null
}
