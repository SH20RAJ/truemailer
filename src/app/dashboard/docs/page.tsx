import type { Metadata } from "next";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const metadata: Metadata = {
  title: "API Documentation",
  description: "Endpoints, headers, and examples for TruMailer API v2.",
};

export default function DocsPage() {
  return <DashboardClient section="docs" />;
}

