"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, Mail, AlertTriangle } from "lucide-react";

export function WhyTrueMailer() {
  return (
    <section id="why-truemailer" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-foreground"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Why Use TrueMailer?
          </motion.h2>

          <motion.div
            className="max-w-3xl mx-auto bg-card border border-border rounded-xl p-8 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <p className="text-xl font-medium text-foreground mb-4">
              <span className="text-muted-foreground mr-1">The Problem:</span> Cold email campaigns fail because of bad data.
            </p>
            <p className="text-lg text-muted-foreground">
              <span className="text-foreground font-medium mr-1">The Solution:</span> TrueMailer catches fake, invalid, and risky emails <span className="text-foreground font-semibold underline decoration-wavy decoration-muted-foreground/30 underline-offset-4">before</span> you send, protecting your domain and increasing open rates.
            </p>
          </motion.div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Benefit 1 */}
          <BenefitCard
            icon={<Zap className="h-6 w-6 text-foreground" />}
            title="Reduce Bounce Rate"
            description="Keep your bounce rate under 1% by identifying undeliverable addresses instantly."
            delay={0}
          />

          {/* Benefit 2 */}
          <BenefitCard
            icon={<ShieldCheck className="h-6 w-6 text-foreground" />}
            title="Improve Sender Reputation"
            description="Protect your domain health and avoid landing in spam folders."
            delay={0.1}
          />

          {/* Benefit 3 */}
          <BenefitCard
            icon={<Mail className="h-6 w-6 text-foreground" />}
            title="Cleaner Cold Email Campaigns"
            description="Stop wasting money sending emails to bots, dead inboxes, and disposable addresses."
            delay={0.2}
          />

          {/* Benefit 4 */}
          <BenefitCard
            icon={<AlertTriangle className="h-6 w-6 text-foreground" />}
            title="Avoid Spam Traps"
            description="Detect risky emails that can blacklist your domain and ruin your deliverability."
            delay={0.3}
          />
        </div>
      </div>
    </section>
  );
}

function BenefitCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      className="flex gap-5 p-8 bg-card rounded-2xl border border-border hover:border-primary/20 transition-colors duration-300"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      <div className="h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center shrink-0 border border-border/50">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-3 text-foreground tracking-tight">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}