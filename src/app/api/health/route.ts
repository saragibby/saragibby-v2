import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const headers = { "Cache-Control": "no-store" }
  if (process.env.SITE_PREVIEW === "true") {
    return NextResponse.json({ status: "draft-preview" }, { status: 503, headers })
  }
  try {
    const [{ getPayload }, { default: config }] = await Promise.all([
      import("payload"),
      import("@payload-config"),
    ])
    const payload = await getPayload({ config })
    await payload.count({ collection: "resources", overrideAccess: false })
    return NextResponse.json({ status: "ready" }, { headers })
  } catch (error) {
    console.error("Application readiness check failed.", error)
    return NextResponse.json({ status: "unavailable" }, { status: 503, headers })
  }
}
