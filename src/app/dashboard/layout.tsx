import TwitterSidebar from "@/components/dashboard/twitter-sidebar"
import { ReactNode } from "react"

export const metadata: { title: string; description: string } = {
  title: 'Dashboard',
  description: 'Dashboard layout with sidebar navigation',
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard-theme flex min-h-screen">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:bg-primary focus:text-primary-foreground focus:px-3 focus:py-2 focus:rounded-md z-50">
        Skip to content
      </a>
      <TwitterSidebar />
      <main id="main-content" className="flex-1 md:ml-64">
        {children}
      </main>
    </div>
  )
}
