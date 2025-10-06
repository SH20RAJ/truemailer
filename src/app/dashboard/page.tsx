import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: 'API Dashboard - Manage Keys & Analytics',
  description: 'Manage your TrueMailer API keys, monitor usage analytics, test email validation, and access comprehensive API documentation.',
  keywords: [
    'API dashboard',
    'API key management', 
    'email validation analytics',
    'API usage monitoring',
    'email validation playground',
    'API documentation',
    'developer tools',
    'usage statistics'
  ],
  openGraph: {
    title: 'TrueMailer API Dashboard',
    description: 'Manage your API keys, monitor usage analytics, and test email validation with our comprehensive dashboard.',
    type: 'website',
  },
  robots: {
    index: false, // Dashboard should not be indexed
    follow: false,
  },
};

export default function Dashboard() {
  redirect("/dashboard/overview");
}
