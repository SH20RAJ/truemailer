import type { Metadata } from "next";
import { HelpImproveClient } from "@/components/landing/help-improve-client";

export const metadata: Metadata = {
  title: 'Help Improve Email Validation - Community Contributions',
  description: 'Help improve TrueMailer\'s email validation accuracy by reporting spam domains and suggesting legitimate email addresses. Join our community-driven spam detection system.',
  keywords: [
    'email validation improvement',
    'spam reporting',
    'community contributions',
    'email spam detection',
    'domain reporting',
    'email validation community',
    'user-generated data',
    'crowdsourced validation'
  ],
  openGraph: {
    title: 'Help Improve Email Validation - TrueMailer Community',
    description: 'Join our community to improve email validation accuracy by reporting spam and suggesting legitimate domains.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HelpImprovePage() {
  return (
    <>
      <HelpImproveClient />
    </>
  );
}