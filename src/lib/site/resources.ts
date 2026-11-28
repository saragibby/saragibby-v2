import { lastCheckedLabel, pickPillars, pillarLabel } from "./picks"

// One Payload collection ("resources") feeds two hubs. Guides, articles and
// videos live on /learn; everything you use (templates, prompts, how-tos…)
// lives on /toolkit. The type decides the hub, so an item can't be on both.

export type ResourceHub = "learn" | "toolkit"

export const resourceTypes = [
  { value: "guide", label: "Guide", hub: "learn" },
  { value: "article", label: "Article", hub: "learn" },
  { value: "video", label: "Video", hub: "learn" },
  { value: "template", label: "Template", hub: "toolkit" },
  { value: "checklist", label: "Checklist", hub: "toolkit" },
  { value: "prompt", label: "Prompt", hub: "toolkit" },
  { value: "calculator", label: "Calculator", hub: "toolkit" },
  { value: "how-to", label: "How-to guide", hub: "toolkit" },
  { value: "agent", label: "Agent", hub: "toolkit" },
] as const satisfies readonly {
  value: string
  label: string
  hub: ResourceHub
}[]

export type ResourceType = (typeof resourceTypes)[number]["value"]

/** Toolkit sections, in page order. Empty sections are hidden. */
export const toolkitSections = [
  {
    id: "templates",
    title: "Templates & checklists",
    types: ["template", "checklist"],
  },
  { id: "prompts", title: "Prompts", types: ["prompt"] },
  { id: "calculators", title: "Calculators (soon)", types: ["calculator"] },
  { id: "how-to", title: "How-to guides", types: ["how-to"] },
  {
    id: "agents",
    title: "Agents & assistants (soon)",
    types: ["agent"],
  },
] as const satisfies readonly {
  id: string
  title: string
  types: readonly ResourceType[]
}[]

export const resourceAccessOptions = [
  { value: "free", label: "Free" },
  { value: "email", label: "Free with email" },
] as const

export type ResourceAccess = (typeof resourceAccessOptions)[number]["value"]

/** The parts of a resource the hubs and cards need. */
export type ResourceSummary = {
  title: string
  slug: string
  resourceType: string
  pillar?: string | null
  access?: string | null
  lastChecked?: string | null
  excerpt: string
}

export function resourceTypeLabel(value: string) {
  return resourceTypes.find((type) => type.value === value)?.label ?? ""
}

/** The hub a type belongs to, or undefined for an unknown type. */
export function resourceHub(value: string): ResourceHub | undefined {
  return resourceTypes.find((type) => type.value === value)?.hub
}

/** /learn/<slug> or /toolkit/<slug>; undefined when the type is unknown. */
export function resourcePath(resource: {
  slug: string
  resourceType: string
}): string | undefined {
  const hub = resourceHub(resource.resourceType)
  return hub ? `/${hub}/${resource.slug}` : undefined
}

export function resourceAccessLabel(value: string | null | undefined) {
  return value === "email" ? "Free with email" : "Free"
}

/** "Last checked Nov 2026", or undefined when there is no date. */
export function resourceLastCheckedLabel(date: string | null | undefined) {
  return date ? `Last checked ${lastCheckedLabel(date)}` : undefined
}

export function resourcePillarLabel(value: string | null | undefined) {
  return value ? pillarLabel(value) : ""
}

export function isPillar(value: unknown): value is string {
  return (
    typeof value === "string" &&
    pickPillars.some((pillar) => pillar.value === value)
  )
}

export function resourcesForHub<T extends ResourceSummary>(
  resources: T[],
  hub: ResourceHub
): T[] {
  return resources.filter(
    (resource) => resourceHub(resource.resourceType) === hub
  )
}

export function filterByPillar<T extends ResourceSummary>(
  resources: T[],
  pillar: string | undefined
): T[] {
  return pillar
    ? resources.filter((resource) => resource.pillar === pillar)
    : resources
}

/** Toolkit items grouped into sections, leaving out the empty ones. */
export function groupToolkit<T extends ResourceSummary>(resources: T[]) {
  return toolkitSections
    .map((section) => ({
      ...section,
      items: resources.filter((resource) =>
        (section.types as readonly string[]).includes(resource.resourceType)
      ),
    }))
    .filter((section) => section.items.length > 0)
}

function str(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined
}

/**
 * A Payload resource record as a summary, or undefined when it can't be
 * linked: no usable slug, or a type that belongs to neither hub.
 */
export function toResourceSummary(
  value: Record<string, unknown>
): ResourceSummary | undefined {
  const slug = str(value.slug)
  const resourceType = str(value.resourceType)
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return undefined
  if (!resourceType || !resourceHub(resourceType)) return undefined
  return {
    title: str(value.title) ?? slug,
    slug,
    resourceType,
    pillar: str(value.pillar) ?? null,
    access: str(value.access) ?? null,
    lastChecked: str(value.lastChecked) ?? null,
    excerpt: str(value.excerpt) ?? "",
  }
}

export function toResourceSummaries(values: Record<string, unknown>[]) {
  return values.flatMap((value) => toResourceSummary(value) ?? [])
}
