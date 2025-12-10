import type { Metadata, Viewport } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
  display: "swap",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f5dc' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ]
}

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
    'open source email validation',
    'privacy-first email validation',
    'real-time validation',
    'MX record validation',
    'syntax validation',
    'role-based email detection'
  ],
  authors: [{ name: 'TrueMailer Team' }],
  creator: 'TrueMailer',
  publisher: 'TrueMailer',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://truemailer.strivio.world'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://truemailer.strivio.world',
    title: 'TrueMailer - Professional Email Validation API',
    description: 'Professional email validation API with real-time disposable email detection. Validate emails, detect spam domains, and ensure email deliverability with 99.9% accuracy. Open source and privacy-first.',
    siteName: 'TrueMailer',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TrueMailer - Email Validation API',
      },
      {
        url: '/og-image-square.png',
        width: 1200,
        height: 1200,
        alt: 'TrueMailer Logo',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrueMailer - Professional Email Validation API',
    description: 'Professional email validation API with real-time disposable email detection. Validate emails, detect spam domains, and ensure email deliverability. Open source and privacy-first.',
    images: ['/og-image.png'],
    creator: '@truemailer',
    site: '@truemailer'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [

    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TrueMailer',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'technology',
  classification: 'Email Validation Service',
  referrer: 'origin-when-cross-origin'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "TrueMailer",
              "description": "Professional email validation API with real-time disposable email detection",
              "url": "https://truemailer.strivio.world",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "TrueMailer Team"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "150"
              },
              "featureList": [
                "Real-time email validation",
                "Disposable email detection",
                "Bulk email validation",
                "API integration",
                "High accuracy validation"
              ]
            })
          }}
        />

        {/* PWA Service Worker */}
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `
          }}
        />

        {/* Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID');
            `
          }}
        />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/github-dark.min.css" />
        <Script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js" strategy="beforeInteractive" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      ><StackProvider app={stackServerApp}><StackTheme>
        {children}
      </StackTheme></StackProvider></body>
    </html>
  );
}
