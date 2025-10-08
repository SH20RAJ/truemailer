import type { Metadata } from "next";
import { LandingClient } from "@/components/landing/landing-client";

export const metadata: Metadata = {
  title: {
    default: 'TrueMailer - Professional Email Validation API',
    template: '%s | TrueMailer'
  },
  description: 'Professional email validation API with real-time disposable email detection. Validate emails, detect spam domains, and ensure email deliverability with 99.9% accuracy. Open source, privacy-first, and lightning fast.',
  keywords: [
    'email validation',
    'email verification',
    'disposable email detection',
    'spam email filter',
    'email API',
    'email deliverability',
    'temporary email detection',
    'email validation service',
    'bulk email validation',
    'email hygiene',
    'API integration',
    'developer tools',
    'open source email validation'
  ],
  authors: [{ name: 'TrueMailer Team' }],
  creator: 'TrueMailer',
  publisher: 'TrueMailer',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://truemailer.strivio.world',
    title: 'TrueMailer - Professional Email Validation API',
    description: 'Professional email validation API with real-time disposable email detection. Validate emails, detect spam domains, and ensure email deliverability with 99.9% accuracy.',
    siteName: 'TrueMailer',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TrueMailer - Email Validation API',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrueMailer - Professional Email Validation API',
    description: 'Professional email validation API with real-time disposable email detection. Open source, privacy-first, and lightning fast.',
    images: ['/og-image.png'],
    creator: '@truemailer',
    site: '@truemailer'
  },
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return (
    <>
      <LandingClient />
    </>
  );
}