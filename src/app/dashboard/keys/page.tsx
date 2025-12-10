import type { Metadata } from "next";
import { ApiKeysClient } from "@/components/dashboard/api-keys-client";

export const metadata: Metadata = {
  title: "API Keys",
  description: "Create and manage your API keys.",
};

export default function KeysPage() {
  return <ApiKeysClient />;
}

