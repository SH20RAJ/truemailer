import type { Metadata } from "next";
import { TestAPIClient } from "@/components/landing/test-api-client";

export const metadata: Metadata = {
  title: 'Test Email Validation API - Interactive Testing',
  description: 'Test TrueMailer\'s email validation API with real examples. Validate emails instantly, detect disposable addresses, and see detailed validation results.',
  keywords: [
    'email validation test',
    'API testing',
    'email validation demo',
    'disposable email test',
    'spam email detection',
    'email API playground',
    'validation testing tool',
    'email verification demo'
  ],
  openGraph: {
    title: 'Test Email Validation API - TrueMailer',
    description: 'Test our email validation API with real examples and see instant results.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TestAPIPage() {
  return (
    <>
      <TestAPIClient />
    </>
  );
}