import { notFound } from "next/navigation"
import {
  RecapContainer,
  createBlogRecapConfig,
  createGeneralRecapConfig,
  getAvailableRecapYears,
} from "@features/recap"

interface RecapPageProps {
  params: Promise<{ year: string }>
}

export async function generateStaticParams() {
  const years = getAvailableRecapYears()
  return years.map((year) => ({ year: year.toString() }))
}

export async function generateMetadata({ params }: RecapPageProps) {
  const { year } = await params
  return {
    title: `${year} Recap | CarefreeHub`,
    description: `${year}년 활동 회고`,
  }
}

export default async function RecapPage({ params }: RecapPageProps) {
  const { year: yearParam } = await params
  const year = parseInt(yearParam, 10)

  if (isNaN(year)) {
    notFound()
  }

  const availableYears = getAvailableRecapYears()
  if (!availableYears.includes(year)) {
    notFound()
  }

  // const config = createBlogRecapConfig(year)
  const config = createGeneralRecapConfig(year)

  return <RecapContainer config={config} />
}
