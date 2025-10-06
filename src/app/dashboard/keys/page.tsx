import type { Metadata } from "next";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const metadata: Metadata = {
  title: "API Keys",
  description: "Create and manage your API keys.",
};

export default function KeysPage() {
  return <DashboardClient section="keys" />;
}

