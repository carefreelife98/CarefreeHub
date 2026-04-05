import { LightbulbIcon } from "lucide-react"

interface InsightHint {
  title: string
  description: string
  highlightValues: { text: string; position: number }[]
}

interface Props {
  hint: InsightHint
}

export function InsightHint({ hint }: Props) {
  return (
    <div className="rounded-lg border-l-2 border-gentity/60 bg-gentity-dim px-4 py-3 space-y-1">
      <div className="flex items-center gap-2">
        <LightbulbIcon className="size-4 text-gentity" />
        <span className="text-sm font-semibold text-gentity">{hint.title}</span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{hint.description}</p>
      {hint.highlightValues.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {hint.highlightValues.map((hv, i) => (
            <span
              key={i}
              className="text-xs font-semibold font-mono text-gentity bg-muted px-2 py-0.5 rounded"
            >
              {hv.text}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
