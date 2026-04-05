import { getApiUrl } from "@/lib/api-url"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const upstream = await fetch(
      `${getApiUrl()}/api/gentity/analyze/${encodeURIComponent(id)}/events`,
      {
        cache: "no-store",
      }
    )

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
