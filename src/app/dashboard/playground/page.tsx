import type { Metadata } from "next";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const metadata: Metadata = {
  title: "Validation Playground",
  description: "Test email validation with your API key in real time.",
};

export default function PlaygroundPage() {
  return <DashboardClient section="playground" />;
}

