import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AppSidebarSocialLinks from "./AppSidebarSocialLinks";
import { siteConfig } from "@/config/site";

export default function AppSidebarFooter() {
  return (
    <Card className="p-1 gap-1 border-none">
      <AppSidebarSocialLinks />
      <CardContent className="text-sm text-muted-foreground flex flex-col gap-2">
        <span>Designed by {siteConfig.sidebar.footer.designedBy}</span>
      </CardContent>
      <CardFooter className="flex flex-col p-1 items-center justify-center">  
        <span className="text-[10px] text-muted-foreground">© {new Date().getFullYear()}. Carefree Lab Co. All rights reserved.</span>
      </CardFooter>
    </Card>
  )
}