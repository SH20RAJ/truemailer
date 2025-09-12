"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export function TechStack() {
  const technologies = [
    {
      name: "Hono",
      description: "Fast edge framework for building web applications",
      logo: (
        <div className="h-12 w-12 rounded-lg bg-gradient-beige flex items-center justify-center text-primary-foreground font-bold text-xl">
          H
        </div>
      )
    },
    {
      name: "Cloudflare Workers",
      description: "Global serverless platform for lightning-fast execution",
      logo: (
        <div className="h-12 w-12 rounded-lg bg-gradient-beige flex items-center justify-center text-primary-foreground font-bold text-xl">
          CF
        </div>
      )
    },
    {
      name: "DNS Lookups",
      description: "MX record verification for domain validation",
      logo: (
        <div className="h-12 w-12 rounded-lg bg-gradient-beige flex items-center justify-center text-primary-foreground font-bold text-xl">
          DNS
        </div>
      )
    }
  ];

  return (
    <section id="tech-stack" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-gradient"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Built with Modern Technology
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            TrueMailer leverages cutting-edge technologies for maximum performance and reliability.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="h-full bg-card/50 border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      {tech.logo}
                      <CardTitle className="ml-4 text-xl">{tech.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{tech.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}