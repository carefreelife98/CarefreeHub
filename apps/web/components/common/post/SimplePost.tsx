"use client"

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface SimplePostProps {
  title: string
  createdBy: string
  linkUrl: string
}

export function SimplePost({ title, createdBy, linkUrl }: SimplePostProps) {
  const router = useRouter()
  return (
    <Card
      className="w-full py-3 rounded-none border-none shadow-none cursor-pointer"
      onClick={() => router.push(linkUrl)}
    >
      <CardContent className="flex flex-col items-start justify-start gap-1 p-0">
        <CardTitle className="text-sm font-medium line-clamp-2">{title}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground line-clamp-1">
          {createdBy}
        </CardDescription>
      </CardContent>
    </Card>
  )
}
