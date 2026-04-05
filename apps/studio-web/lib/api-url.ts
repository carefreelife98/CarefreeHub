export function getApiUrl(): string {
  const url = process.env.API_URL
  if (!url) {
    throw new Error("API_URL environment variable is not set")
  }
  return url
}
