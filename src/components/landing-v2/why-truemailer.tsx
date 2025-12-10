"use client";

import { motion } from "framer-motion";

export function WhyTrueMailer() {
  const benefits = [
    {
      title: "Lightning Fast",
      description: "Sub-50ms response times with global CDN",
      icon: (
        <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Privacy First",
      description: "Zero data storage - your emails are never logged",
      icon: (
        <svg className="h-6 w-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      title: "Comprehensive Validation",
      description: "Detects valid, disposable, role-based, and spammy emails",
      icon: (
        <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Developer Friendly",
      description: "Simple REST API with JSON responses and extensive documentation",
      icon: (
        <svg className="h-6 w-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    }
  ];

  const comparison = [
    { feature: "Syntax Validation", truemailer: true, others: true },
    { feature: "MX Record Lookup", truemailer: true, others: true },
    { feature: "Disposable Detection", truemailer: true, others: "Limited" },
    { feature: "Role-based Detection", truemailer: true, others: "Limited" },
    { feature: "Privacy (Zero Logging)", truemailer: true, others: false },
    { feature: "Response Time (<50ms)", truemailer: true, others: false },
    { feature: "Free Tier", truemailer: true, others: "Paid" },
    { feature: "Open Source", truemailer: true, others: false },
  ];

  return (
    <section id="why-truemailer" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Why Use TrueMailer?
          </motion.h2>

          <motion.div
            className="max-w-3xl mx-auto bg-card border border-primary/10 rounded-2xl p-6 md:p-8 mb-12 shadow-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-xl font-medium text-foreground mb-4">
              <span className="text-red-500">The Problem:</span> Cold email campaigns fail because of bad data.
            </p>
            <p className="text-lg text-muted-foreground">
              <span className="text-green-500 font-medium">The Solution:</span> TrueMailer catches fake, invalid, and risky emails <span className="text-foreground font-semibold">before</span> you send, protecting your domain and increasing open rates.
            </p>
          </motion.div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          {/* Benefit 1 */}
          <motion.div
            className="flex gap-4 p-6 bg-background rounded-xl border border-border/50 hover:border-primary/20 transition-all"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Reduce Bounce Rate</h3>
              <p className="text-muted-foreground">Keep your bounce rate under 1% by identifying undeliverable addresses instantly.</p>
            </div>
          </motion.div>

          {/* Benefit 2 */}
          <motion.div
            className="flex gap-4 p-6 bg-background rounded-xl border border-border/50 hover:border-primary/20 transition-all"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Improve Sender Reputation</h3>
              <p className="text-muted-foreground">Protect your domain health and avoid landing in spam folders.</p>
            </div>
          </motion.div>

          {/* Benefit 3 */}
          <motion.div
            className="flex gap-4 p-6 bg-background rounded-xl border border-border/50 hover:border-primary/20 transition-all"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Cleaner Cold Email Campaigns</h3>
              <p className="text-muted-foreground">Stop wasting money sending emails to bots, dead inboxes, and disposable addresses.</p>
            </div>
          </motion.div>

          {/* Benefit 4 */}
          <motion.div
            className="flex gap-4 p-6 bg-background rounded-xl border border-border/50 hover:border-primary/20 transition-all"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
              <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Avoid Spam Traps</h3>
              <p className="text-muted-foreground">Detect risky emails that can blacklist your domain and ruin your deliverability.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}