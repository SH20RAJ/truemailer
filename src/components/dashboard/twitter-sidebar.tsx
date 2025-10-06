"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  Home,
  Search,
  Bell,
  MessageSquare,
  ListTodo,
  Bookmark,
  BarChart3,
  Key,
  BookOpen,
  Settings,
  User,
  Feather,
} from "lucide-react"
import { useMemo } from "react"

type NavItem = {
  label: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  isActive?: (path: string, tab: string | null) => boolean
}

export function TwitterSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab")

  const items: NavItem[] = useMemo(
    () => [
      { label: "Home", href: "/dashboard?tab=overview", icon: Home, isActive: (_, t) => (t ?? "overview") === "overview" },
      { label: "Explore", href: "/dashboard?tab=docs", icon: Search, isActive: (_, t) => t === "docs" },
      { label: "Notifications", href: "/dashboard?tab=overview", icon: Bell, isActive: () => false },
      { label: "Messages", href: "/dashboard?tab=playground", icon: MessageSquare, isActive: (_, t) => t === "playground" },
      { label: "Lists", href: "/dashboard?tab=personal-lists", icon: ListTodo, isActive: (_, t) => t === "personal-lists" },
      { label: "Bookmarks", href: "/dashboard", icon: Bookmark, isActive: () => false },
      { label: "Analytics", href: "/dashboard?tab=overview", icon: BarChart3, isActive: (_, t) => (t ?? "overview") === "overview" },
      { label: "API Keys", href: "/dashboard?tab=overview", icon: Key, isActive: (_, t) => (t ?? "overview") === "overview" },
      { label: "Docs", href: "/dashboard?tab=docs", icon: BookOpen, isActive: (_, t) => t === "docs" },
      { label: "Profile", href: "/dashboard", icon: User, isActive: () => false },
      { label: "Settings", href: "/dashboard", icon: Settings, isActive: () => pathname?.endsWith("/settings") ?? false },
    ],
    [pathname]
  )

  return (
    <Sidebar collapsible="icon" variant="inset" className="border-sidebar-border">
      <SidebarHeader className="px-2 py-3">
        <div className="flex items-center justify-between px-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary rounded-full p-2">
              <Feather className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold group-data-[collapsible=icon]/sidebar:hidden">
              TrueMailer
            </span>
          </Link>
          <SidebarTrigger className="group-data-[collapsible=icon]/sidebar:hidden" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const ActiveIcon = item.icon
                const active = item.isActive?.(pathname ?? "", tab) ?? false
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild isActive={active} size="lg">
                      <Link href={item.href} prefetch={false}>
                        <ActiveIcon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="px-2 mt-2">
          <Button asChild className="w-full h-12 text-base font-semibold">
            <Link href="/dashboard?tab=playground" prefetch={false}>
              New Validation
            </Link>
          </Button>
        </div>

        <SidebarSeparator className="my-3" />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-sidebar-accent cursor-pointer transition-colors">
          <div className="size-8 rounded-full bg-muted" />
          <div className="min-w-0 group-data-[collapsible=icon]/sidebar:hidden">
            <div className="text-sm font-medium truncate">You</div>
            <div className="text-xs text-muted-foreground truncate">@truemailer</div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default TwitterSidebar
