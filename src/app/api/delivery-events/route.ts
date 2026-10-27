import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST() {
  return NextResponse.json(
    {
      error:
        'Delivery-event processing is disabled until an email provider and its webhook signature contract are selected.',
    },
    { status: 503, headers: { 'Cache-Control': 'no-store' } },
  )
}
