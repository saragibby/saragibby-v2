import type { Payload } from 'payload'
import { assertBackendAvailable } from './preview'

let payloadPromise: Promise<Payload> | undefined

export function getServerPayload() {
  assertBackendAvailable()
  payloadPromise ??= Promise.all([
    import('payload'),
    import('@payload-config'),
  ]).then(([{ getPayload }, { default: config }]) => getPayload({ config }))
  return payloadPromise
}
