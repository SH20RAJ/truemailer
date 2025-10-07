"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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
import { Home, Key, Play, ListTodo, BookOpen, Feather } from "lucide-react"
import { useMemo } from "react"
import { useUser } from "@stackframe/stack"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type NavItem = {
  label: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export function TwitterSidebar() {
  const user = useUser()
  const pathname = usePathname()
  type MaybeUser = { displayName?: string | null }
  type MaybeContact = { email?: string | null }
  type MaybeImage = { photoURL?: string | null; imageUrl?: string | null }
  const u = user as unknown as MaybeUser & MaybeContact & MaybeImage
  const userEmail: string = u?.email ?? ""
  const initial: string = (u?.displayName?.[0] || userEmail?.[0] || "U").toUpperCase()

  const items: NavItem[] = useMemo(
    () => [
      { label: "Overview", href: "/dashboard/overview", icon: Home },
      { label: "API Keys", href: "/dashboard/keys", icon: Key },
      { label: "Playground", href: "/dashboard/playground", icon: Play },
      { label: "Personal Lists", href: "/dashboard/personal-lists", icon: ListTodo },
      { label: "Docs", href: "/dashboard/docs", icon: BookOpen },
    ],
    []
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
                const active = (pathname ?? "").startsWith(item.href)
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

        <SidebarSeparator className="my-3" />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-sidebar-accent transition-colors">
          <Avatar className="h-8 w-8">
            {/* If your auth provides an image URL, set it here */}
            <AvatarImage src={u?.photoURL ?? u?.imageUrl ?? undefined} alt={u?.displayName ?? "User"} />
            <AvatarFallback>
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 group-data-[collapsible=icon]/sidebar:hidden">
            <div className="text-sm font-medium truncate">{user?.displayName || "User"}</div>
            <div className="text-xs text-muted-foreground truncate">{userEmail}</div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default TwitterSidebar
