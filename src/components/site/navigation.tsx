"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRef, useState } from "react"
import {
  kitHref,
  kitLabel,
  primaryNavigation,
  SERVICE_NAV_LABEL,
  serviceHref,
} from "@/lib/site/site-navigation"

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Navigation({ picksLive = false }: { picksLive?: boolean }) {
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const pathname = usePathname() ?? "/"
  const close = () => setOpen(false)

  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !open) return
        setOpen(false)
        toggle.current?.focus()
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
          <div className="nav-primary">
            {primaryNavigation(picksLive).map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={close}
                aria-current={isCurrent(pathname, href) ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="nav-actions">
            <Link
              className="nav-service"
              href={serviceHref}
              onClick={close}
              aria-current={
                isCurrent(pathname, serviceHref) ? "page" : undefined
              }
            >
              {SERVICE_NAV_LABEL}
            </Link>
            <Link className="button nav-kit" href={kitHref} onClick={close}>
              {kitLabel}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
