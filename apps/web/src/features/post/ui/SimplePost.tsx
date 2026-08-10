"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardTitle } from "@shared/ui"
import { trackPostClick } from "@features/analytics"

interface SimplePostProps {
  title: string
  createdBy: string
  linkUrl: string
}

export function SimplePost({ title, createdBy, linkUrl }: SimplePostProps) {
  return (
    <Card className="w-full py-3 rounded-none border-none shadow-none hover:bg-muted/50 transition-colors">
      <Link
        href={linkUrl}
        onClick={() => trackPostClick({ slug: linkUrl.replace("/posts/", ""), title })}
      >
        <CardContent className="flex flex-col items-start justify-start gap-1 p-0">
          <CardTitle className="text-sm font-medium line-clamp-2">{title}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground line-clamp-1">
            {createdBy}
          </CardDescription>
        </CardContent>
      </Link>
    </Card>
  )
}
