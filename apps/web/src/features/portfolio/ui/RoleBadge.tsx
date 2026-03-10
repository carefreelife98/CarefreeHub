import { Badge } from "@shared/ui"
import { cn } from "@shared/lib"

const roleColors: Record<string, string> = {
  "단독 설계/구현": "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
  Backend: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Frontend: "bg-sky-500/15 text-sky-400 border-sky-500/20",
  "Full Stack": "bg-violet-500/15 text-violet-400 border-violet-500/20",
}

interface RoleBadgeProps {
  roles: string[]
}

export function RoleBadge({ roles }: RoleBadgeProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {roles.map((role) => (
        <Badge
          key={role}
          variant="outline"
          className={cn(
            "text-xs font-medium print:border print:bg-transparent",
            roleColors[role] ?? "bg-muted text-muted-foreground"
          )}
        >
          {role}
        </Badge>
      ))}
    </div>
  )
}
