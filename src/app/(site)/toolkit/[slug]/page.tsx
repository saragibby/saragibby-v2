import { ResourceDetail, resourceMetadata } from "@/components/site/resource-detail"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  return resourceMetadata((await params).slug)
}

export default async function ToolkitItem({ params }: Props) {
  return <ResourceDetail hub="toolkit" slug={(await params).slug} />
}
