"use client"

import { useState } from "react"

const choices = [
  { name: "One", signal: [true, false, false, false, false, false] },
  { name: "Two", signal: [false, true, false, false, false, false] },
  { name: "Three", signal: [false, false, true, false, false, false] },
  { name: "Four", signal: [false, false, false, true, false, false] },
  { name: "Five", signal: [false, false, false, false, true, false] },
  { name: "Six", signal: [false, false, false, false, false, true] },
]

export function SignalGame() {
  const [target, setTarget] = useState<number | null>(null)
  const [message, setMessage] = useState(
    "An optional, untimed mini game. Match the highlighted signal with its number."
  )
  const [found, setFound] = useState(false)
  function start() {
    setTarget(Math.floor(Math.random() * choices.length))
    setFound(false)
    setMessage(
      "A signal is ready. Choose its matching number. There is no timer."
    )
  }
  function choose(index: number) {
    if (index === target) {
      setFound(true)
      setMessage("Signal found. A small win, even on a wrong turn.")
    } else {
      setMessage("Not that frequency. Take another look and try again.")
    }
  }
  return (
    <section className="signal-game card" aria-labelledby="signal-heading">
      <p className="eyebrow">A small detour</p>
      <h2 id="signal-heading">Find the signal.</h2>
      {target !== null && (
        <div
          className="signal-display"
          role="img"
          aria-label={`Signal position ${target + 1} of 6`}
        >
          {choices[target].signal.map((active, index) => (
            <span
              className={active ? "signal-light is-active" : "signal-light"}
              key={index}
              aria-hidden="true"
            />
          ))}
        </div>
      )}
      <p role="status" className="muted">
        {message}
      </p>
      {target === null || found ? (
        <button className="button" onClick={start}>
          {found ? "Play again" : "Try the signal game"}
        </button>
      ) : (
        <div
          className="signal-choices"
          role="group"
          aria-label="Choose the highlighted signal position"
        >
          {choices.map((choice, index) => (
            <button
              key={choice.name}
              onClick={() => choose(index)}
              aria-label={`Signal ${choice.name.toLowerCase()}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
