import type { Metadata } from "next";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const metadata: Metadata = {
  title: "Personal Lists",
  description: "Manage your personal blocklist and whitelist entries.",
};

export default function PersonalListsPage() {
  return <DashboardClient section="personal-lists" />;
}

