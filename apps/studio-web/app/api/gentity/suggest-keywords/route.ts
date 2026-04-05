import { getApiUrl } from "@/lib/api-url"

export const runtime = "nodejs"

export async function POST() {
  try {
    const upstream = await fetch(`${getApiUrl()}/api/gentity/suggest-keywords`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })
    if (!upstream.ok) return new Response("error", { status: 502 })
    const data = await upstream.json()
    return Response.json(data)
  } catch (e) {
    console.error("[suggest-keywords] upstream fetch failed:", e)
    return Response.json({ error: String(e), apiUrl: process.env.API_URL ?? "NOT_SET" }, { status: 500 })
  }
}
