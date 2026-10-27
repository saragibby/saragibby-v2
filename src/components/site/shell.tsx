import Link from "next/link"
import {
  preview,
  configured,
  items,
  safeHref,
  text,
  type RecordValue,
} from "@/lib/site/content"

export function StatusBanner() {
  if (preview)
    return (
      <aside className="preview-banner">
        Draft preview · Content and offerings are not launch-approved. Email
        delivery requires configured services.
      </aside>
    )
  if (!configured)
    return (
      <aside className="preview-banner">
        The site is being prepared. Published content is not available yet.
      </aside>
    )
  return null
}

export function Footer({ site = {} }: { site?: RecordValue }) {
  const groups = [
    {
      title: "Learn",
      links: [
        ["Start Here", "/start-here"],
        ["Course", "/course"],
        ["Resources", "/resources"],
        ["Newsletter", "/newsletter"],
        ["Now", "/now"],
      ],
    },
    {
      title: "Work with me",
      links: [
        ["Shop", "/shop"],
        ["Community", "/community"],
        ["Build With Me", "/build-with-me"],
        ["About", "/about"],
      ],
    },
    {
      title: "The fine print",
      links: [
        ["Privacy", "/privacy"],
        ["Terms", "/terms"],
        ["Disclaimer", "/disclaimer"],
      ],
    },
  ]
  return (
    <footer className="site-footer container">
      <div>
        <Link className="wordmark" href="/">
          {text(site.siteName, "Sara Gibby")}
        </Link>
        <p className="muted small">Made after hours in Michigan.</p>
        <p className="handwriting">a little time. something real.</p>
        {items(site.socialLinks).map((social, index) => {
          const href = safeHref(social.url)
          return href ? (
            <a className="footer-social" key={index} href={href}>
              {text(social.label)}
            </a>
          ) : null
        })}
      </div>
      {groups.map((group) => (
        <nav key={group.title} aria-label={group.title}>
          <h2 className="eyebrow">{group.title}</h2>
          {group.links.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
      ))}
    </footer>
  )
}

export function PageIntro({
  label,
  title,
  children,
}: {
  label: string
  title: string
  children?: React.ReactNode
}) {
  return (
    <header className="page-intro">
      <p className="eyebrow">{label}</p>
      <h1>{title}</h1>
      {children && <div className="lead">{children}</div>}
    </header>
  )
}
