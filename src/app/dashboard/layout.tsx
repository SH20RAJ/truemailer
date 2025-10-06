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
      <SidebarProvider defaultOpen>
        <TwitterSidebar />
        <SidebarRail />
        <SidebarInset>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

