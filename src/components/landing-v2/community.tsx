"use client";

import { Button } from "rizzui";
import { motion } from "framer-motion";
import Link from "next/link";

export function Community() {
  const communityLinks = [
    {
      title: "GitHub Repository",
      description: "View source code, report issues, and contribute",
      icon: (
        <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
        </svg>
      ),
      link: "https://github.com/sh20raj/truemailer"
    },
    {
      title: "Documentation",
      description: "Comprehensive guides and API references",
      icon: (
        <svg className="h-6 w-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      link: "https://github.com/sh20raj/truemailer#api-usage"
    },
    {
      title: "Issue Tracker",
      description: "Report bugs and request features",
      icon: (
        <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      ),
      link: "https://github.com/sh20raj/truemailer/issues"
    }
  ];

  return (
    <section id="community" className="py-20 bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-gradient"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Community & Open Source
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            TrueMailer is open source and community-driven. Join us in building a better email validation service.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {communityLinks.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="h-full bg-card/50 border border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 rounded-xl">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    {item.icon}
                    <h3 className="ml-3 text-xl font-semibold">{item.title}</h3>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <p className="text-muted-foreground mb-4">{item.description}</p>
                  <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10" as={Link} href={item.link} target="_blank">
                    Visit
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-r from-muted/30 to-primary/30 border border-primary/30 max-w-2xl mx-auto rounded-xl">
            <div className="p-6 pt-0 py-8">
              <h3 className="text-2xl font-bold mb-2">MIT Licensed</h3>
              <p className="text-muted-foreground mb-6">
                TrueMailer is completely free and open source under the permissive MIT license.
              </p>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-medium transition-all duration-300 transform hover:scale-105" as={Link} href="https://github.com/sh20raj/truemailer" target="_blank">
                View License on GitHub
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}