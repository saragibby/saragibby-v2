"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import {
  comingSoonNavigation,
  kitLabel,
  siteNavigation,
} from "@/lib/site/site-navigation"

export function Navigation() {
  const [open, setOpen] = useState(false)
  const [soonOpen, setSoonOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const soonToggle = useRef<HTMLButtonElement>(null)
  const soonGroup = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!soonOpen) return
    const closeOutside = (event: PointerEvent) => {
      if (!soonGroup.current?.contains(event.target as Node)) setSoonOpen(false)
    }
    document.addEventListener("pointerdown", closeOutside)
    return () => document.removeEventListener("pointerdown", closeOutside)
  }, [soonOpen])

  const close = () => {
    setOpen(false)
    setSoonOpen(false)
  }

  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key !== "Escape") return
        if (soonOpen) {
          setSoonOpen(false)
          soonToggle.current?.focus()
        } else if (open) {
          setOpen(false)
          toggle.current?.focus()
        }
      }}
    >
      <div className="container header-inner">
        <Link className="wordmark" href="/" aria-label="Sara Gibby home">
          Sara Gibby
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
          <Link className="button" href="/newsletter" onClick={close}>
            {kitLabel}
          </Link>
          {siteNavigation.map(({ label, href }) => (
            <Link key={href} href={href} onClick={close}>
              {label}
            </Link>
          ))}
          <div
            ref={soonGroup}
            className="nav-group"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node))
                setSoonOpen(false)
            }}
          >
            <button
              ref={soonToggle}
              type="button"
              className="nav-group-toggle"
              aria-expanded={soonOpen}
              aria-controls="coming-soon-nav"
              onClick={() => setSoonOpen(!soonOpen)}
            >
              Coming soon
            </button>
            <div
              id="coming-soon-nav"
              className="nav-group-menu"
              hidden={!soonOpen}
            >
              {comingSoonNavigation.map(({ label, href }) => (
                <Link key={href} href={href} onClick={close}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
