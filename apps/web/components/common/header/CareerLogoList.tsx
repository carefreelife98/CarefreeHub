import { AvatarCircles } from "@/components/ui/avatar-circles"
import { siteConfig } from "@/config/site"

export default function CareerLogoList() {
  return (
    <AvatarCircles
      className="flex items-center justify-center"
      avatarUrls={siteConfig.header.author.career.map((career) => ({
        imageUrl: career.icon,
        profileUrl: career.url,
      }))}
    />
  )
}
