"use client"

import { useSyncExternalStore } from "react"
import { aiTranslations } from "@/lib/site/homepage-design"

const storageKey = "translator-phrase"
let current: number | undefined

// Reads the phrase shown last time, moves to the next one, and keeps that
// choice until the page is loaded again.
function phraseForVisit() {
  if (current !== undefined) return current
  current = 0
  try {
    const last = localStorage.getItem(storageKey)
    const index = last === null ? -1 : Number(last)
    if (Number.isInteger(index))
      current = Math.max(0, index + 1) % aiTranslations.length
    localStorage.setItem(storageKey, String(current))
  } catch {
    /* Storage can be blocked. The first phrase still works. */
  }
  return current
}

export function TranslatorSpotlight() {
  const index = useSyncExternalStore(
    () => () => {},
    phraseForVisit,
    () => 0
  )
  const translation = aiTranslations[index]
  return (
    <article className="translator-spotlight">
      <div>
        <p className="eyebrow">What they said</p>
        <h3>{translation.theySaid}</h3>
      </div>
      <div>
        <p className="eyebrow">What they meant</p>
        <p>{translation.theyMeant}</p>
      </div>
    </article>
  )
}
