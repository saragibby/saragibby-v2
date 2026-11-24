import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import config from '@payload-config'
import { importMap } from './admin/importMap.js'
import { assertBackendAvailable } from '@/lib/server/preview'
import localFont from 'next/font/local'
import '@payloadcms/next/css'
import './admin-theme.css'

const manrope = localFont({
  src: '../(site)/fonts/manrope-latin.woff2',
  weight: '400 800',
  variable: '--font-manrope',
  display: 'swap',
})
const caveat = localFont({
  src: '../(site)/fonts/caveat-latin.woff2',
  weight: '400 600',
  variable: '--font-caveat',
  display: 'swap',
})
const mono = localFont({
  src: '../(site)/fonts/ibm-plex-mono-latin.woff2',
  weight: '400',
  variable: '--font-plex-mono',
  display: 'swap',
})

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
      htmlProps={{
        className: `${manrope.variable} ${caveat.variable} ${mono.variable}`,
      }}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  )
}
