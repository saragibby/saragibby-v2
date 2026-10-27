import Link from "next/link"
import { SignalGame } from "@/components/site/signal-game"

export default function NotFound() {
  return (
    <div className="container section interior not-found">
      <header className="page-intro">
        <p className="eyebrow">404 · Off the map</p>
        <h1>
          Wrong turn.
          <br />
          Still a good signal.
        </h1>
        <p className="lead">
          That page isn’t here. It may have moved, or the link might have a
          typo. Let’s get you back to something useful.
        </p>
        <div className="error-actions">
          <Link className="button" href="/">
            Back to home
          </Link>
          <Link className="text-link" href="/resources">
            Explore resources →
          </Link>
        </div>
      </header>
      <SignalGame />
    </div>
  )
}
