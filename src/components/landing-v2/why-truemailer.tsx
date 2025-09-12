"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <section id="why-truemailer" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-gradient"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Why Choose TrueMailer?
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            TrueMailer stands out from the crowd with its unique combination of speed, privacy, and comprehensive validation.
          </motion.p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-card/50 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    {benefit.icon}
                    <CardTitle className="ml-2 text-lg">{benefit.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-card/50 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl text-center">TrueMailer vs Other Email Validation APIs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-primary/20">
                      <th className="text-left py-3">Feature</th>
                      <th className="text-center py-3">TrueMailer</th>
                      <th className="text-center py-3">Other APIs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.map((item, index) => (
                      <tr key={index} className="border-b border-primary/10 hover:bg-primary/5">
                        <td className="py-3">{item.feature}</td>
                        <td className="text-center py-3">
                          {item.truemailer === true ? (
                            <span className="text-green-400">✓</span>
                          ) : (
                            item.truemailer
                          )}
                        </td>
                        <td className="text-center py-3">
                          {item.others === true ? (
                            <span className="text-green-400">✓</span>
                          ) : item.others === false ? (
                            <span className="text-red-400">✗</span>
                          ) : (
                            item.others
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}