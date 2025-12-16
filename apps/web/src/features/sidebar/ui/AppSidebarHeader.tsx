import { Card, CardDescription, CardHeader, CardTitle } from "@shared/ui"
import { BorderBeam } from "@shared/ui"
import Image from "next/image"
import { siteConfig } from "@shared/config"

export default function AppSidebarHeader() {
  return (
    <Card className="relative p-0">
      <BorderBeam duration={8} size={100} borderWidth={1.5} />
      <CardHeader className="p-3 gap-2">
        <div className="flex flex-row items-center gap-3">
          <Image
            src="/user/author.jpeg"
            alt="author-image"
            width={48}
            height={48}
            className="rounded-full shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <CardTitle className="text-sm font-semibold truncate">
              {siteConfig.header.author.title}
            </CardTitle>
            <CardDescription className="text-xs text-center text-muted-foreground truncate">
              {siteConfig.header.author.job}
            </CardDescription>
          </div>
        </div>
        <CardDescription className="text-xs text-center line-clamp-2 py-2">
          {siteConfig.header.author.description}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
