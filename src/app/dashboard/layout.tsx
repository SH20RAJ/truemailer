"use client"

import {
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"
import TwitterSidebar from "@/components/dashboard/twitter-sidebar"
import { ReactNode } from "react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard-theme">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:bg-primary focus:text-primary-foreground focus:px-3 focus:py-2 focus:rounded-md z-50">
        Skip to content
      </a>
      <SidebarProvider defaultOpen>
        <TwitterSidebar />
        <SidebarRail />
        <SidebarInset id="main-content">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
