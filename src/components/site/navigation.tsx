"use client"

import Link from "next/link"
import { useRef, useState } from "react"

const defaultLinks = [
  ["Start Here", "/start-here"],
  ["Course", "/course"],
  ["Community", "/community"],
  ["Shop", "/shop"],
  ["Build With Me", "/build-with-me"],
]

export function Navigation({
  links = defaultLinks,
  name = "Sara Gibby",
}: {
  links?: string[][]
  name?: string
}) {
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false)
          toggle.current?.focus()
        }
      }}
    >
      <div className="container header-inner">
        <Link className="wordmark" href="/" aria-label={`${name} home`}>
          {name}
        </Link>
        <button
          ref={toggle}
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}
        </button>
        <nav
          id="site-nav"
          className={open ? "navigation is-open" : "navigation"}
          aria-label="Main navigation"
        >
          {links.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <Link
            className="button"
            href="/newsletter"
            onClick={() => setOpen(false)}
          >
            Free Starter Kit
          </Link>
        </nav>
      </div>
    </header>
  )
}
