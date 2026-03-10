import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Portfolio | CarefreeHub",
  description: "프로젝트 포트폴리오",
}

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground print:min-h-0 print:bg-white print:text-black">
      {children}
    </div>
  )
}
