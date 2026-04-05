import { getApiUrl } from "@/lib/api-url"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown
    const res = await fetch(`${getApiUrl()}/api/gentity/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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
