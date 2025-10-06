"use client";

import { motion } from "framer-motion";

export function Features() {
  const features = [
    {
      title: "Syntax Validation",
      description: "RFC-compliant email syntax checking to ensure proper formatting",
      icon: "✓",
      color: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
    },
    {
      title: "MX Record Lookup",
      description: "Verifies domain DNS records to check if it can receive emails",
      icon: "🌐",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
    },
    {
      title: "Disposable Detection",
      description: "Identifies temporary email services like 10minutemail, Guerrilla Mail",
      icon: "🛡️",
      color: "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
    },
    {
      title: "Role-based Detection",
      description: "Detects generic emails like admin@, support@, info@ that aren't personal",
      icon: "👥",
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
    },
    {
      title: "REST API",
      description: "Simple JSON API responses for easy integration with any application",
      icon: "⚡",
      color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
    },
    {
      title: "Privacy First",
      description: "Zero data storage policy - your emails are never logged or saved",
      icon: "🔒",
      color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
    }
  ];

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
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="h-full p-8 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
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