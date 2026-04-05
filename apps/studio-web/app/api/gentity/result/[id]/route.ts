import { getApiUrl } from "@/lib/api-url"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const res = await fetch(`${getApiUrl()}/api/gentity/result/${encodeURIComponent(id)}`, {
      cache: "no-store",
    })
    const data = (await res.json()) as unknown
    return Response.json(data, { status: res.status })
  } catch (err) {
    const message = err instanceof Error ? err.message : "proxy error"
    return Response.json(
      { success: false, error: { code: "PROXY_ERROR", message } },
      { status: 502 }
    )
  }
}
