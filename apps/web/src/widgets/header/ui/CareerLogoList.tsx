import { AvatarCircles } from "@shared/ui"
import { siteConfig } from "@shared/config"

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
