"use client"

import {
  createContext,
  useContext,
  useId,
  useState,
  type FormEvent,
} from "react"
import Link from "next/link"

type Interest = "kit" | "newsletter" | "course" | "community" | "shop"

const FormPolicy = createContext({ enabled: false, kitReady: false, deliveryEnabled: true })

export function FormPolicyProvider({
  enabled,
  kitReady,
  deliveryEnabled = true,
  children,
}: {
  enabled: boolean
  kitReady: boolean
  deliveryEnabled?: boolean
  children: React.ReactNode
}) {
  return (
    <FormPolicy.Provider value={{ enabled, kitReady, deliveryEnabled }}>
      {children}
    </FormPolicy.Provider>
  )
}

async function submitJSON(endpoint: string, body?: unknown, method = "POST") {
  const response = await fetch(endpoint, {
    method,
    headers: { "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  let result: unknown
  try {
    result = await response.json()
  } catch {
    throw new Error(
      "The service could not be reached. Please try again in a moment."
    )
  }
  const data =
    result && typeof result === "object"
      ? (result as Record<string, unknown>)
      : {}
  if (!response.ok)
    throw new Error(
      typeof data.error === "string"
        ? data.error
        : "Something went wrong. Please try again."
    )
  return typeof data.message === "string"
    ? data.message
    : "Your request has been received."
}

export function SignupForm({
  source,
  interest = "kit",
  button = "Send me the kit",
}: {
  source: string
  interest?: Interest
  button?: string
}) {
  const id = useId()
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState("")
  const [error, setError] = useState("")
  const { enabled, kitReady, deliveryEnabled } = useContext(FormPolicy)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    setPending(true)
    setError("")
    setResult("")
    try {
      setResult(
        await submitJSON("/api/newsletter", {
          email: data.get("email"),
          marketingConsent: data.get("marketingConsent") === "on",
          interest,
          source,
          website: data.get("website"),
        })
      )
      form.reset()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to connect. Please try again."
      )
    } finally {
      setPending(false)
    }
  }
  if (!deliveryEnabled)
    return (
      <p className="notice small">
        Signup is not open yet. Email delivery is being connected.
      </p>
    )
  if (!enabled)
    return (
      <p className="notice small">
        Signup is not open yet. Privacy information is awaiting owner approval.
      </p>
    )
  if (interest === "kit" && !kitReady)
    return (
      <p className="notice small">
        The Starter Kit is not released yet. Please check back for availability.
      </p>
    )
  return (
    <form className="signup-form" onSubmit={submit} aria-busy={pending}>
      <label htmlFor={`${id}-email`}>Email address</label>
      <div className="signup-row">
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          maxLength={254}
          disabled={pending}
        />
        <button className="button" disabled={pending}>
          {pending ? "Sending…" : button}
        </button>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Leave this field empty</label>
        <input
          id={`${id}-website`}
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <label className="consent" htmlFor={`${id}-consent`}>
        <input
          id={`${id}-consent`}
          type="checkbox"
          name="marketingConsent"
          required={interest !== "kit"}
          disabled={pending}
        />
        <span>
          {interest === "kit"
            ? "Also send me the newsletter and occasional product updates (optional)."
            : "I agree to receive email about this interest and occasional updates."}{" "}
          Unsubscribe anytime. <Link href="/privacy">Privacy details</Link>.
        </span>
      </label>
      <p className="form-message" role="status">
        {result}
      </p>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}

export function InquiryForm() {
  const id = useId()
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const { enabled, deliveryEnabled } = useContext(FormPolicy)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    setPending(true)
    setError("")
    setMessage("")
    try {
      setMessage(await submitJSON("/api/inquiry", Object.fromEntries(data)))
      form.reset()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to connect. Please try again."
      )
    } finally {
      setPending(false)
    }
  }
  if (!deliveryEnabled)
    return (
      <p className="notice">
        Online inquiries are not open yet. Email delivery is being connected.
      </p>
    )
  if (!enabled)
    return (
      <p className="notice">
        Inquiries will open once the privacy information is approved.
      </p>
    )
  return (
    <form className="inquiry-form" onSubmit={submit} aria-busy={pending}>
      <label htmlFor={`${id}-name`}>Your name</label>
      <input
        id={`${id}-name`}
        name="name"
        autoComplete="name"
        required
        maxLength={150}
        disabled={pending}
      />
      <label htmlFor={`${id}-email`}>Email address</label>
      <input
        id={`${id}-email`}
        name="email"
        type="email"
        autoComplete="email"
        required
        maxLength={254}
        disabled={pending}
      />
      <label htmlFor={`${id}-message`}>
        What are you building, and where could you use a hand?
      </label>
      <textarea
        id={`${id}-message`}
        name="message"
        rows={6}
        required
        minLength={10}
        maxLength={5000}
        disabled={pending}
      />
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Leave this field empty</label>
        <input
          id={`${id}-website`}
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <p className="small muted">
        Your details are used to respond to your inquiry, not to subscribe you
        to marketing. <Link href="/privacy">Privacy details</Link>.
      </p>
      <button className="button" disabled={pending}>
        {pending ? "Sending…" : "Send inquiry"}
      </button>
      <p role="status">{message}</p>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}

export function TokenAction({
  token,
  action,
}: {
  token: string
  action: "confirm" | "unsubscribe"
}) {
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState("")
  const [error, setError] = useState("")
  async function submit() {
    setPending(true)
    setError("")
    try {
      setResult(
        await submitJSON(
          `/api/${action}?token=${encodeURIComponent(token)}`,
          undefined,
          action === "confirm" ? "GET" : "POST"
        )
      )
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to connect. Please try again."
      )
    } finally {
      setPending(false)
    }
  }
  if (!token)
    return (
      <p className="notice">
        This link is missing its verification token. Please use the complete
        link in your email.
      </p>
    )
  return (
    <div>
      {!result && (
        <button className="button" onClick={submit} disabled={pending}>
          {pending
            ? "Please wait…"
            : action === "confirm"
              ? "Confirm my email"
              : "Unsubscribe me"}
        </button>
      )}
      <p role="status">{result}</p>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
