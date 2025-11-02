import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";


export default function Logo({ className }: { className?: string }) {
  return (
    <Avatar className={cn("w-5 h-5", className)}>
      <AvatarImage src={siteConfig.logo.src} />
      <AvatarFallback>L</AvatarFallback>
    </Avatar>
  )
}