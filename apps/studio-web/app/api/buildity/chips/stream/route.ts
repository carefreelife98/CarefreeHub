import { getApiUrl } from "@/lib/api-url"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown
    const upstream = await fetch(`${getApiUrl()}/api/buildity/chips/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    })

    if (!upstream.ok || !upstream.body) {
      return new Response("upstream error", { status: 502 })
    }

    return new Response(upstream.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "proxy error"
    return new Response(`event: error\ndata: ${JSON.stringify({ error: message })}\n\n`, {
      status: 502,
      headers: { "Content-Type": "text/event-stream" },
    })
  }
}
