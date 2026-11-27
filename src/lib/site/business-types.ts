// Options for "What kind of business do you run?" on the kit signup form.
// The values are stored on subscriber records, so add new ones rather than
// renaming existing values.
export const businessTypes = [
  { label: "Service business", value: "service" },
  { label: "Retail or e-commerce", value: "retail-ecommerce" },
  { label: "Agency or freelancer", value: "agency-freelancer" },
  { label: "Startup or tech product", value: "startup-tech" },
  { label: "Restaurant or hospitality", value: "restaurant-hospitality" },
  { label: "Nonprofit", value: "nonprofit" },
  { label: "Other", value: "other" },
] as const

export type BusinessType = (typeof businessTypes)[number]["value"]

export const businessTypeValues = businessTypes.map(({ value }) => value) as [
  BusinessType,
  ...BusinessType[],
]
