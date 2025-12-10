"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Key,
    BarChart3,
    List,
    BookOpen,
    Settings,
    LogOut,
    Menu,
} from "lucide-react";
import { useState } from "react";
import { Button } from "rizzui";

const navItems = [
    {
        title: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "API Keys",
        href: "/dashboard/keys",
        icon: Key,
    },
    {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart3,
    },
    {
        title: "Personal Lists",
        href: "/dashboard/lists",
        icon: List,
    },
    {
        title: "Documentation",
        href: "/docs",
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <>
            {/* Mobile Trigger */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Button variant="outline" size="sm" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                    <Menu className="h-4 w-4" />
                </Button>
            </div>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r border-border transition-transform duration-300 md:translate-x-0",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex h-16 items-center border-b border-border px-6">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                            <img src="/icons/icon-72x72.png" alt="TrueMailer" className="h-8 w-8 rounded-lg" />
                            TrueMailer
                        </Link>
                    </div>

                    {/* Nav */}
                    <div className="flex-1 overflow-y-auto py-6 px-3">
                        <nav className="space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                        onClick={() => setIsMobileOpen(false)}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.title}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-border p-4">
                        <Link
                            href="/dashboard/settings"
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground",
                                pathname === "/dashboard/settings" && "bg-primary/10 text-primary"
                            )}
                        >
                            <Settings className="h-4 w-4" />
                            Settings
                        </Link>
                        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors mt-1">
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    );
}
