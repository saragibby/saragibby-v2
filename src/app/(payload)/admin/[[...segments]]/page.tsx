import {
  generatePageMetadata,
  RootPage,
} from '@payloadcms/next/views'
import config from '@payload-config'
import { importMap } from '../importMap.js'

type RouteParams = {
  params: Promise<{ segments?: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export const generateMetadata = ({ params, searchParams }: RouteParams) =>
  generatePageMetadata({
    config,
    params,
    searchParams,
  })

export default async function AdminPage({
  params,
  searchParams,
}: RouteParams) {
  const payloadParams = params.then(({ segments }) => ({
    segments: segments ?? [],
  }))
  return RootPage({ config, importMap, params: payloadParams, searchParams })
}
