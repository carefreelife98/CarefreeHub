import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Dock, DockIcon } from "@/components/ui/dock";

export default function AppSidebarSocialLinks() {
  return (
    <Dock 
      direction="middle" 
      className="h-10 w-full m-0 justify-around bg-white rounded-lg"
      iconSize={32}
      iconMagnification={40}
      iconDistance={120}
    >
      {siteConfig.sidebar.footer.socialLinks.map((link) => (
        <DockIcon key={link.name} className="h-8 w-8 hover:bg-gray-100">
          <a 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label={link.alt}
            className="flex items-center justify-center w-full h-full"
          >
            <Image 
              src={link.icon} 
              alt={link.alt} 
              width={20} 
              height={20} 
              className="object-contain" 
            />
          </a>
        </DockIcon>
      ))}
    </Dock>
  )
}