"use client";

import { Button } from "rizzui";
import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Modern grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/50 to-primary/5"></div>

      {/* Floating elements - modern and minimal */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-primary/5 blur-xl"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full bg-accent/5 blur-xl"
          animate={{
            y: [0, 20, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Main content area with card-like design */}
          <div className="text-center space-y-8">
            {/* Status badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Live & Open Source
            </motion.div>

            {/* Main headline - bold and clean */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                <span className="text-foreground">True</span>
                <span className="text-primary">Mailer</span>
              </h1>

              <h2 className="text-2xl md:text-3xl font-medium text-muted-foreground max-w-3xl mx-auto">
                Professional email validation API with real-time verification
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Detect disposable emails, validate syntax, and check deliverability with 99.9% accuracy.
              Privacy-first, lightning-fast, and developer-friendly.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button
                size="lg"
                className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full transition-all duration-200 hover:scale-105 flex items-center gap-2"
                as={Link}
                href="/dashboard"
              >
                Get Started Free
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 border-border hover:bg-muted/50 font-medium rounded-full transition-all duration-200 flex items-center gap-2"
                as={Link}
                href="https://github.com/sh20raj/truemailer"
                target="_blank"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View Source
              </Button>
            </motion.div>

            {/* Key metrics - clean and minimal */}
            <motion.div
              className="grid grid-cols-3 gap-8 max-w-md mx-auto pt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-foreground">1M+</div>
                <div className="text-sm text-muted-foreground font-medium">Validations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-foreground">99.9%</div>
                <div className="text-sm text-muted-foreground font-medium">Accurate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-foreground">{"<50ms"}</div>
                <div className="text-sm text-muted-foreground font-medium">Response</div>
              </div>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="flex justify-center items-center gap-6 pt-8 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Zero Data Storage
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                GDPR Compliant
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                Open Source
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}