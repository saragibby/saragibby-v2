import Link from "next/link"
import { configured, preview, safeHref } from "@/lib/site/content"
import { siteSocialLinks } from "@/lib/site/site-navigation"

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

export function Footer() {
  const groups = [
    {
      title: "Learn",
      links: [
        ["Course", "/course"],
        ["Playbooks", "/resources"],
        ["About", "/about"],
        ["Now", "/now"],
      ],
    },
    {
      title: "Get help",
      links: [
        ["Ask Sara", "/community"],
        ["Reviews", "/build-with-me"],
        ["Free CTO Kit", "/newsletter"],
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
        <Link className="wordmark" href="/">Sara Gibby</Link>
        <p className="muted small">
          Clear answers for your biggest tech decisions.
        </p>
        <p className="handwriting">no jargon. no judgment. just answers.</p>
        {siteSocialLinks.flatMap(({ label, url }) => {
          const href = safeHref(url)
          return href ? (
            <a className="footer-social" key={url} href={href}>
              {label}
            </a>
          ) : []
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
