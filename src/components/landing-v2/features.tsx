"use client";

import { motion } from "framer-motion";

export function Features() {


  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-6 text-foreground"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Everything you need to validate emails
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Comprehensive email validation that keeps spam out and ensures deliverability
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group"
          >
            <div className="h-full p-8 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl mb-6">
                ⚡
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Real-time API Validation</h3>
              <p className="text-muted-foreground leading-relaxed">
                Verify emails instantly at the point of entry. Perfect for sign-up forms and lead capture.
              </p>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="group"
          >
            <div className="h-full p-8 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-2xl mb-6">
                📁
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Bulk CSV Verification</h3>
              <p className="text-muted-foreground leading-relaxed">
                Upload your existing email lists and get a clean, validated file back in minutes.
              </p>
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="group"
          >
            <div className="h-full p-8 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl mb-6">
                🛡️
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Disposable Email Detection</h3>
              <p className="text-muted-foreground leading-relaxed">
                Automatically block temporary and burner emails to protect your user base quality.
              </p>
            </div>
          </motion.div>

          {/* Feature 4 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="group"
          >
            <div className="h-full p-8 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-2xl mb-6">
                🎯
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Risk Scoring</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get a quality score for every email. Identify frequent complainers, spam traps, and low-quality domains.
              </p>
            </div>
          </motion.div>

          {/* Feature 5 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -5 }}
            className="group"
          >
            <div className="h-full p-8 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl mb-6">
                🔍
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Syntax, SMTP & Domain Checks</h3>
              <p className="text-muted-foreground leading-relaxed">
                Deep validation beyond just regex. We check if the mailbox actually exists and can receive mail.
              </p>
            </div>
          </motion.div>

          {/* Feature 6 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            whileHover={{ y: -5 }}
            className="group"
          >
            <div className="h-full p-8 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl mb-6">
                📊
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Dashboard with Reports</h3>
              <p className="text-muted-foreground leading-relaxed">
                Track your usage, view validation history, and download clean lists directly from a modern dashboard.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-muted/50 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            All features available instantly with our free API
          </div>
        </motion.div>
      </div>
    </section>
  );
}