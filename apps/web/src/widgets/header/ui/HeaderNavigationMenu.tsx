"use client"

import * as React from "react"
import Link from "next/link"
import { GithubIcon, LinkedinIcon, MailIcon } from "lucide-react"
import { useIsMobile } from "@shared/hooks"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  Card,
} from "@shared/ui"
import { useRouter } from "next/navigation"
import { siteConfig, categoryTree } from "@shared/config"
import CareerLogoList from "./CareerLogoList"

export default function HeaderNavigationMenu() {
  const isMobile = useIsMobile()
  const router = useRouter()
  return (
    <NavigationMenu viewport={isMobile} className="w-full max-w-none justify-center">
      <NavigationMenuList className="flex-wrap justify-center gap-8">
        <NavigationMenuItem>
          <NavigationMenuTrigger>Carefreelife98</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Card
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-center rounded-md bg-linear-to-b px-4 py-2 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md md:p-6"
                    onClick={() => router.push("/about")}
                  >
                    <CareerLogoList />
                    <div className="mb-2 text-lg font-medium sm:mt-4 text-center">
                      {siteConfig.header.author.title}
                    </div>
                    <p className="text-muted-foreground text-sm leading-tight text-center">
                      {siteConfig.header.author.job}
                    </p>
                  </Card>
                </NavigationMenuLink>
              </li>
              <ListItem href="/about/introduction" title="자기 소개">
                제가 누군지 소개할게요
              </ListItem>
              <ListItem href="/about/skills" title="기술 스택">
                제가 사용하는 기술 스택을 소개할게요
              </ListItem>
              <ListItem href="/about/projects" title="프로젝트 경험">
                제가 참여한 프로젝트를 소개할게요
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>포스트</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[400px]">
              {categoryTree.map((category) => (
                <ListItem
                  key={category.slug}
                  title={category.name}
                  href={`/posts/category/${category.slug}`}
                >
                  {category.description || ""}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden md:block">
          <NavigationMenuTrigger>링크</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href="https://github.com/Carefreelife98"
                    target="_blank"
                    className="flex-row items-center gap-2"
                  >
                    <GithubIcon />
                    Github
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href="https://www.linkedin.com/in/carefreelife98/"
                    target="_blank"
                    className="flex-row items-center gap-2"
                  >
                    <LinkedinIcon />
                    Linkedin
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href="mailto:csm12180318@gmail.com"
                    target="_blank"
                    className="flex-row items-center gap-2"
                  >
                    <MailIcon />
                    Gmail
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
