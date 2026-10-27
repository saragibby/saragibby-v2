"use client"

import Link from "next/link"

export default function PublicError({ reset }: { reset: () => void }) {
  return (
    <section className="container section interior">
      <p className="eyebrow">A brief interruption</p>
      <h1>The signal dropped.</h1>
      <p className="lead">
        This content could not be loaded. Please try again in a moment.
      </p>
      <div className="error-actions">
        <button className="button" onClick={reset}>
          Try again
        </button>
        <Link className="text-link" href="/">
          Back to home →
        </Link>
      </div>
    </section>
  )
}
