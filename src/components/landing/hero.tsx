import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          TrueMailer
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-10">
          A lightweight and fast <span className="font-semibold text-foreground">email validation API</span> built to help developers check whether an email address is valid, disposable, role-based, or spammy.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild>
            <Link href="#api-usage">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="https://github.com/sh20raj/trumailer" target="_blank">
              View on GitHub
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}