import { RecapBanner, getAvailableRecapYears } from "@features/recap"

export function MainRecapBanner() {
  const years = getAvailableRecapYears()

  if (years.length === 0) {
    return null
  }

  return <RecapBanner year={years[0]} />
}
