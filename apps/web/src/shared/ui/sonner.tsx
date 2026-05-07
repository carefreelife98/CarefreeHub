"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          // Warm Ink 의미 컬러 — sage/coral/amber/ink 패밀리
          success:
            "!bg-[oklch(0.96_0.03_160)] !text-[oklch(0.32_0.1_160)] !border-[oklch(0.45_0.12_160)]/20",
          error:
            "!bg-[oklch(0.96_0.03_25)] !text-[oklch(0.4_0.15_25)] !border-[oklch(0.5_0.17_25)]/20",
          warning:
            "!bg-[oklch(0.96_0.04_75)] !text-[oklch(0.4_0.13_75)] !border-[oklch(0.5_0.13_75)]/20",
          info: "!bg-[oklch(0.96_0.03_250)] !text-[oklch(0.32_0.13_250)] !border-[oklch(0.42_0.16_250)]/20",
          loading: "!bg-muted !text-muted-foreground !border-border",
          description: "!text-inherit opacity-80",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
