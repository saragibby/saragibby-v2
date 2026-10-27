import { Fragment, type ReactNode } from "react"
import Image from "next/image"
import { items, record, text } from "@/lib/site/content"

function safeURL(value: unknown) {
  const url = text(value)
  return /^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(url) ? url : undefined
}

function renderNode(value: unknown, index: number): ReactNode {
  const node = record(value)
  const children = items(node.children).map(renderNode)
  if (node.type === "text") {
    let result: ReactNode = typeof node.text === "string" ? node.text : ""
    const format = typeof node.format === "number" ? node.format : 0
    if (format & 1) result = <strong>{result}</strong>
    if (format & 2) result = <em>{result}</em>
    if (format & 16) result = <code>{result}</code>
    return <Fragment key={index}>{result}</Fragment>
  }
  switch (node.type) {
    case "heading": {
      const Tag = ["h2", "h3", "h4"].includes(text(node.tag))
        ? (text(node.tag) as "h2" | "h3" | "h4")
        : "h2"
      return <Tag key={index}>{children}</Tag>
    }
    case "paragraph":
      return <p key={index}>{children}</p>
    case "list":
      return node.listType === "number" ? (
        <ol key={index}>{children}</ol>
      ) : (
        <ul key={index}>{children}</ul>
      )
    case "listitem":
      return <li key={index}>{children}</li>
    case "quote":
      return <blockquote key={index}>{children}</blockquote>
    case "linebreak":
      return <br key={index} />
    case "link":
    case "autolink": {
      const fields = record(node.fields)
      const doc = record(fields.doc)
      const linked = record(doc.value)
      const relation = text(doc.relationTo)
      const internal =
        linked.slug && ["pages", "resources"].includes(relation)
          ? `${relation === "resources" ? "/resources" : ""}/${encodeURIComponent(text(linked.slug))}`
          : undefined
      const href = safeURL(internal ?? fields.url ?? node.url)
      return href ? (
        <a key={index} href={href}>
          {children}
        </a>
      ) : (
        <Fragment key={index}>{children}</Fragment>
      )
    }
    case "upload":
      return <ContentImage key={index} value={node.value} />
    default:
      return <Fragment key={index}>{children}</Fragment>
  }
}

export function ContentImage({ value }: { value: unknown }) {
  const media = record(value)
  const src = safeURL(media.url)
  if (!src || !text(media.mimeType).startsWith("image/")) return null
  const width =
    typeof media.width === "number" && media.width > 0 ? media.width : 1200
  const height =
    typeof media.height === "number" && media.height > 0 ? media.height : 800
  return (
    <Image
      className="content-image"
      src={src}
      alt={text(media.alt)}
      width={width}
      height={height}
      sizes="(max-width: 760px) 100vw, 760px"
      unoptimized
    />
  )
}

export function RichText({ value }: { value: unknown }) {
  const root = record(record(value).root)
  return <div className="prose">{items(root.children).map(renderNode)}</div>
}
