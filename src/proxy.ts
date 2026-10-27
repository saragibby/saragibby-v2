import { NextResponse, type NextRequest } from "next/server"
import { isRetiredPath } from "./lib/legacy-routes"

export function proxy(request: NextRequest) {
  if (!isRetiredPath(request.nextUrl.pathname)) return NextResponse.next()

  return new NextResponse(
    '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Page retired | Sara Gibby</title><body style="margin:0;background:#0D1B2A;color:#F5EFE9;font-family:system-ui;line-height:1.6"><main style="max-width:42rem;margin:15vh auto;padding:24px"><p>THE NEXT CHAPTER</p><h1>This page has been retired.</h1><p>The old blog and recipes are no longer published. There is something new taking shape here.</p><a style="color:#5FBFAE" href="/">Visit Sara Gibby</a></main></body></html>',
    {
      status: 410,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "noindex",
        "Cache-Control": "public, max-age=3600",
      },
    }
  )
}

export const config = {
  matcher: ["/blog/:path*", "/eats/:path*", "/brooklynn-karate/:path*", "/recaps/:path*"],
}
