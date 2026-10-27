import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import config from '@payload-config'
import { importMap } from './admin/importMap.js'
import { assertBackendAvailable } from '@/lib/server/preview'

async function serverFunction({
  args,
  name,
}: {
  args: Record<string, unknown>
  name: string
}): Promise<unknown> {
  'use server'
  assertBackendAvailable()
  return handleServerFunctions({ args, name, config, importMap })
}

export default function PayloadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  assertBackendAvailable()
  return (
    <RootLayout
      config={config}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  )
}
