import { ResourceDetail, resourceMetadata } from "@/components/site/resource-detail"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  return resourceMetadata((await params).slug)
}

export default async function LearnItem({ params }: Props) {
  return <ResourceDetail hub="learn" slug={(await params).slug} />
}
