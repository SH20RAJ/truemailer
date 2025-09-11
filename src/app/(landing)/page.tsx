import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { ApiUsage } from "@/components/landing/api-usage";
import { TechStack } from "@/components/landing/tech-stack";
import { Installation } from "@/components/landing/installation";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Hero />
      <Features />
      <ApiUsage />
      <TechStack />
      <Installation />
      <Footer />
    </div>
  );
}