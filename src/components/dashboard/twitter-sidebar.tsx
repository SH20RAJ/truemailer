"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Key, Play, ListTodo, BookOpen, Feather, LogOut } from "lucide-react"
import { useMemo, useState } from "react"
import { useUser } from "@stackframe/stack"

// Assuming Avatar might still be in ui folder if not deleted, effectively checking.
// If ui folder is gone, I should use RizzUI Avatar or generic one.
// The user said "Removed the src/components/ui directory". So I must replace Avatar too.

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
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r border-border bg-background pt-4 pb-4 md:flex">
      <div className="px-6 mb-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary rounded-full p-2">
            <Feather className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold text-foreground">
            TrueMailer
          </span>
        </Link>
      </div>

      <div className="flex-1 px-4 space-y-1">
        {items.map((item) => {
          const ActiveIcon = item.icon
          const isActive = (pathname ?? "").startsWith(item.href)

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              <ActiveIcon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>

      <div className="px-4 mt-auto">
        <div className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted transition-colors cursor-pointer border border-transparent hover:border-border/50">
          {u?.photoURL || u?.imageUrl ? (
            <img
              src={u.photoURL || u.imageUrl || ""}
              alt={u.displayName || "User"}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
              {initial}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium truncate text-foreground">{user?.displayName || "User"}</div>
            <div className="text-xs text-muted-foreground truncate">{userEmail}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default TwitterSidebar
