import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { siteConfig } from "@/config/site"
import { BorderBeam } from "@/components/ui/border-beam"

export default function AppSidebarHeader() {
  return (
    <Card className="relative">
      <BorderBeam duration={8} size={200} borderWidth={2} />
      <CardHeader>
        <Image
          src="/user/author.jpeg"
          alt="author-image"
          width={256}
          height={256}
          className="rounded-full"
        />
        <CardTitle className="text-xl font-semibold text-center">
          {siteConfig.header.author.title}
        </CardTitle>
        <CardDescription className="text-center text-sm text-muted-foreground">
          {siteConfig.header.author.job}
        </CardDescription>
        <CardDescription className="text-center">
          {siteConfig.header.author.description}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
