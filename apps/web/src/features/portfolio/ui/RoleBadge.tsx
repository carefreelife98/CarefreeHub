import { Badge } from "@shared/ui"
import { cn } from "@shared/lib"

// 역할 배지는 카테고리 칩과 마찬가지로 무지개를 피하고
// 잉크/세이지/앰버/코랄 4개로 의미 묶음만 표현한다.
const roleColors: Record<string, string> = {
  "단독 설계/구현":
    "bg-[oklch(0.94_0.04_250)] text-[oklch(0.42_0.16_250)] border-[oklch(0.42_0.16_250)]/20 dark:bg-[oklch(0.3_0.06_250)] dark:text-[oklch(0.78_0.13_250)] dark:border-[oklch(0.78_0.13_250)]/20",
  Backend:
    "bg-[oklch(0.93_0.04_160)] text-[oklch(0.45_0.12_160)] border-[oklch(0.45_0.12_160)]/20 dark:bg-[oklch(0.3_0.05_160)] dark:text-[oklch(0.78_0.12_160)] dark:border-[oklch(0.78_0.12_160)]/20",
  Frontend:
    "bg-[oklch(0.93_0.05_75)] text-[oklch(0.5_0.13_75)] border-[oklch(0.5_0.13_75)]/20 dark:bg-[oklch(0.3_0.05_75)] dark:text-[oklch(0.82_0.13_75)] dark:border-[oklch(0.82_0.13_75)]/20",
  "Full Stack":
    "bg-[oklch(0.94_0.04_25)] text-[oklch(0.5_0.17_25)] border-[oklch(0.5_0.17_25)]/20 dark:bg-[oklch(0.3_0.06_25)] dark:text-[oklch(0.78_0.14_25)] dark:border-[oklch(0.78_0.14_25)]/20",
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
