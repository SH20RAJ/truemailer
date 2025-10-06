import type { Metadata } from "next";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard Overview",
  description: "Usage analytics and API key management at a glance.",
};

export default function OverviewPage() {
  return <DashboardClient section="overview" />;
}

