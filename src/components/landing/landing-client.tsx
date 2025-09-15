"use client";

import { AutoRedirect } from "@/components/auto-redirect";
import { Hero } from "@/components/landing-v2/hero";
import { WhyTrueMailer } from "@/components/landing-v2/why-truemailer";
import { Features } from "@/components/landing-v2/features";
import { HowItWorks } from "@/components/landing-v2/how-it-works";
import { QuickIntegration } from "@/components/landing-v2/quick-integration";
import { TechStack } from "@/components/landing-v2/tech-stack";
import { SuggestEmails } from "@/components/landing-v2/suggest-emails";
import { Community } from "@/components/landing-v2/community";
import { FinalCTA } from "@/components/landing-v2/final-cta";
import { Footer } from "@/components/landing-v2/footer";

export function LandingClient() {
  return (
    <div className="pt-16"> {/* Add padding for fixed navbar */}
      <AutoRedirect />
      <Hero />
      <WhyTrueMailer />
      <Features />
      <HowItWorks />
      <QuickIntegration />
      <TechStack />
      <SuggestEmails />
      <Community />
      <FinalCTA />
      <Footer />
    </div>
  );
}