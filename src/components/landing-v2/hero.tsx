"use client";

import { Button } from "rizzui";
import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Subtle modern background */}
      <div className="absolute inset-0 bg-background"></div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Main content area */}
          <div className="text-center space-y-10">

            {/* Main headline - ultra clean */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-foreground leading-[1.1]">
                Verify Emails. <br />
                <span className="text-primary">Instantly.</span>
              </h1>

              <h2 className="text-xl md:text-2xl font-normal text-muted-foreground/80 max-w-3xl mx-auto leading-relaxed">
                Real-time & bulk email verification API built for developers and growth teams.
              </h2>
            </motion.div>

            {/* Visual Demo - minimalist terminal style */}
            <motion.div
              className="relative mx-auto max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-[#0D0D0D] rounded-xl border border-white/10 shadow-2xl p-4 flex items-center gap-3 font-mono text-sm leading-none overflow-x-auto">
                <span className="text-green-500 shrink-0">➜</span>
                <span className="text-white shrink-0">curl</span>
                <span className="text-gray-400 shrink-0">-X GET</span>
                <span className="text-blue-400 whitespace-nowrap">https://truemailer.strivio.world/api/v2/validate?email=elon@tesla.com</span>
              </div>
              {/* Result tooltip/popover effect */}
              <motion.div
                className="absolute -right-4 -bottom-8 bg-green-500/10 border border-green-500/20 text-green-500 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.4 }}
              >
                ✓ Deliverable
              </motion.div>
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                size="lg"
                className="h-14 px-10 bg-foreground text-background hover:bg-foreground/90 font-medium rounded-full text-lg transition-all"
                as={Link}
                href="/dashboard"
              >
                Get API Key
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 border-border/50 hover:bg-muted/30 text-lg font-medium rounded-full"
                as={Link}
                href="#pricing"
              >
                View Pricing
              </Button>
            </motion.div>

            {/* Micro proof - Minimal */}
            <motion.div
              className="pt-12 flex justify-center items-center gap-8 text-sm text-muted-foreground/60 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <span>99.9% Accuracy</span>
              <span className="h-1 w-1 rounded-full bg-border"></span>
              <span>&lt;50ms Latency</span>
              <span className="h-1 w-1 rounded-full bg-border"></span>
              <span>GDPR Compliant</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}