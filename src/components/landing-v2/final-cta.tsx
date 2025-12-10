"use client";

import { Button } from "rizzui";
import { motion } from "framer-motion";
import Link from "next/link";

export function FinalCTA() {
  return (
    <section id="get-started" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
            Ready to Validate Emails with TrueMailer?
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Join thousands of developers who trust TrueMailer for reliable email validation.
            Get started for free with our generous API limits.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 h-auto" as={Link} href="#get-started">
              Start Validating Now
            </Button>
            <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 px-8 py-6 text-lg font-medium" as={Link} href="https://github.com/sh20raj/truemailer" target="_blank">
              View on GitHub
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Free Forever
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              No Credit Card Required
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              99.9% Uptime
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}