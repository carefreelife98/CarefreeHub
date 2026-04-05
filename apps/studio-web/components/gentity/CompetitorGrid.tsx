import { CompetitorCard } from "./CompetitorCard"
import type { Competitor } from "@carefree-studio/shared"

interface Props {
  competitors: Competitor[]
}

export function CompetitorGrid({ competitors }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {competitors.map((c) => (
        <CompetitorCard key={`${c.platform}-${c.appId}`} competitor={c} />
      ))}
    </div>
  )
}
