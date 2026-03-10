export interface TechItem {
  name: string
  icon?: string // Simple Icons slug
  color?: string
}

export interface TechStackCategory {
  label: string
  items: TechItem[]
}

export interface FeatureDesignPoint {
  title: string
  description: string
}

export interface FeatureStat {
  label: string
  value: number | string
  suffix?: string
  type: "countup" | "progress" | "text"
}

export interface FeatureSubSection {
  title: string
  designs: FeatureDesignPoint[]
  mermaidDiagram: string
  screenshots: ScreenshotPlaceholder[]
}

export interface Feature {
  id: string
  title: string
  roles: string[]
  problem: string
  designs: FeatureDesignPoint[]
  mermaidDiagram: string
  screenshots: ScreenshotPlaceholder[]
  stats: FeatureStat[]
  subSections?: FeatureSubSection[]
}

export interface SummaryFeature {
  id: string
  title: string
  description: string
  techTags: string[]
  stat: {
    label: string
    value: string
  }
  screenshot?: ScreenshotPlaceholder
}

export interface TimelineEvent {
  month: string
  title: string
  description: string
  commits?: number
  highlight?: boolean
}

export interface ScreenshotPlaceholder {
  src: string
  alt: string
  caption: string
}

export interface PortfolioProject {
  slug: string
  title: string
  logo: string
  subtitle: string
  company: string
  team: string
  period: string
  role: string
  highlightBase?: string
  highlights: { label: string; value: string; trend?: string }[]
  overview: string[]
  techStacks: TechStackCategory[]
  features: Feature[]
  challenge: {
    title: string
    beforeImage: string
    afterImage: string
    problem: string
    analysis: string
    solution: string
    results: { label: string; before: string; after: string }[]
  }
  summaryFeatures: SummaryFeature[]
  overallStats: FeatureStat[]
  adoptionCompanies: string[]
  timeline: TimelineEvent[]
  links: {
    recap?: string
    github?: string
    linkedin?: string
    email?: string
  }
}
