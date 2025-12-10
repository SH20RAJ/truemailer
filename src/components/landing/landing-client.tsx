"use client";

import { AutoRedirect } from "@/components/auto-redirect";
import { Hero } from "@/components/landing-v2/hero";
import { WhyTrueMailer } from "@/components/landing-v2/why-truemailer";
import { Features } from "@/components/landing-v2/features";
import { HowItWorks } from "@/components/landing-v2/how-it-works";
import { OneStarReviews } from "@/components/landing-v2/one-star-reviews";
import { Pricing } from "@/components/landing-v2/pricing";
import { FAQ } from "@/components/landing-v2/faq";
import { FinalCTA } from "@/components/landing-v2/final-cta";
import { Footer } from "@/components/landing-v2/footer";

export function LandingClient() {
  return (
    <div className="pt-16">
      <AutoRedirect />
      <Hero />
      <WhyTrueMailer />
      <Features />
      <OneStarReviews />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div >
  );
}