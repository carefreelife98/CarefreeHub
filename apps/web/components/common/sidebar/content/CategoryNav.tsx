"use client"

import { ChevronRight, Folder } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar"
import { categoryTree, type CategoryNode } from "@/config/categories"
import { getCategoryCustomIcon } from "@/components/common/icons/CategoryIcons"
import { cn } from "@/lib/utils"

interface CategoryNavItemProps {
  node: CategoryNode
  level?: number
}

function CategoryNavItem({ node, level = 0 }: CategoryNavItemProps) {
  const pathname = usePathname()
  const { state } = useSidebar()

  const href = `/posts/category/${node.slug}`
  const isActive = pathname === href
  const hasChildren = node.children && node.children.length > 0

  // 커스텀 SVG 아이콘이 있으면 우선 사용, 없으면 Lucide 아이콘 또는 기본 Folder
  const CustomIcon = getCategoryCustomIcon(node.slug)
  const LucideIcon = node.icon || Folder

  // 하위 카테고리 중 하나라도 활성화되어 있으면 펼침
  const isChildActive = node.children?.some(
    (child) =>
      pathname === `/posts/category/${child.slug}` ||
      child.children?.some((grandChild) => pathname === `/posts/category/${grandChild.slug}`)
  )

  // 아이콘 렌더링 헬퍼
  const renderIcon = () => {
    if (CustomIcon) {
      return <CustomIcon size={16} />
    }
    return <LucideIcon className="size-4" />
  }

  if (!hasChildren) {
    // 자식이 없는 경우 - 단순 링크
    if (level === 0) {
      return (
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={isActive} tooltip={node.name}>
            <Link href={href}>
              {renderIcon()}
              <span>{node.name}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )
    }

    return (
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild isActive={isActive}>
          <Link href={href}>
            {renderIcon()}
            <span>{node.name}</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    )
  }

  // 자식이 있는 경우 - Collapsible
  if (level === 0) {
    return (
      <Collapsible asChild defaultOpen={isActive || isChildActive} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={node.name} isActive={isActive}>
              {renderIcon()}
              <span>{node.name}</span>
              <ChevronRight
                className={cn(
                  "ml-auto size-4 transition-transform duration-200",
                  "group-data-[state=open]/collapsible:rotate-90"
                )}
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {node.children?.map((child) => (
                <CategoryNavItem key={child.slug} node={child} level={level + 1} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  // 2단계 이상의 하위 카테고리
  return (
    <Collapsible asChild defaultOpen={isActive || isChildActive} className="group/subcollapsible">
      <SidebarMenuSubItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuSubButton isActive={isActive}>
            {renderIcon()}
            <span>{node.name}</span>
            <ChevronRight
              className={cn(
                "ml-auto size-3 transition-transform duration-200",
                "group-data-[state=open]/subcollapsible:rotate-90"
              )}
            />
          </SidebarMenuSubButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="ml-2 border-l-0 pl-2">
            {node.children?.map((child) => (
              <CategoryNavItem key={child.slug} node={child} level={level + 1} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuSubItem>
    </Collapsible>
  )
}

export function CategoryNav() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Categories</SidebarGroupLabel>
      <SidebarMenu>
        {categoryTree.map((node) => (
          <CategoryNavItem key={node.slug} node={node} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
